const { PrismaClient } = require('@prisma/client');
const { createOrder, verifyPaymentSignature } = require('../services/paymentService');

const prisma = new PrismaClient();

const PLANS = {
    EMPLOYER: {
        BASIC: {
            monthly: { amount: 49, limit: 15 },
            yearly: { amount: 490, limit: 15 } // 10 months price
        },
        STANDARD: {
            monthly: { amount: 99, limit: 25 },
            yearly: { amount: 990, limit: 25 }
        }
    },
    JOBSEEKER: {
        BASIC: {
            monthly: { amount: 49, limit: 15 },
            yearly: { amount: 490, limit: 15 }
        },
        STANDARD: {
            monthly: { amount: 99, limit: 25 },
            yearly: { amount: 990, limit: 25 }
        }
    }
};

const initiateUpgrade = async (req, res) => {
    try {
        const { tier, cycle } = req.body; // tier: 'BASIC'|'STANDARD', cycle: 'monthly'|'yearly'
        const role = req.user.role;

        if (role === 'ADMIN') return res.status(400).json({ error: 'Admins cannot subscribe' });

        const tierConfig = PLANS[role][tier];
        if (!tierConfig) return res.status(400).json({ error: 'Invalid plan tier' });

        const plan = tierConfig[cycle || 'monthly'];
        if (!plan) return res.status(400).json({ error: 'Invalid billing cycle' });

        // Create Razorpay Order
        const order = await createOrder(plan.amount, 'INR', `sub_${req.user.id.substring(0, 10)}_${Date.now()}`);

        res.json({
            orderId: order.id,
            amount: plan.amount,
            currency: 'INR',
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Initiate upgrade error:', error);
        res.status(500).json({ error: 'Failed to initiate upgrade' });
    }
};

const verifyUpgrade = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier, cycle } = req.body;

        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        const role = req.user.role;
        const tierConfig = PLANS[role][tier];
        const plan = tierConfig[cycle || 'monthly'];

        // Calculate end date based on cycle
        const durationDays = (cycle === 'yearly') ? 365 : 30;
        const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

        // Update Subscription
        const subscription = await prisma.subscription.update({
            where: { userId: req.user.id },
            data: {
                tier: tier,
                isActive: true,
                // Update limits based on role
                jobPostsLimit: role === 'EMPLOYER' ? plan.limit : 10,
                contactsLimit: role === 'JOBSEEKER' ? plan.limit : 10,
                amount: plan.amount,
                startDate: new Date(),
                endDate: endDate,
                renewalDate: endDate,
                autoRenew: true
            }
        });

        // Record Transaction
        await prisma.transaction.create({
            data: {
                subscriptionId: subscription.id,
                amount: plan.amount,
                status: 'success',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paymentMethod: 'razorpay'
            }
        });

        res.json({ success: true, message: 'Subscription upgraded successfully', subscription });

    } catch (error) {
        console.error('Verify upgrade error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
};

module.exports = {
    initiateUpgrade,
    verifyUpgrade
};
