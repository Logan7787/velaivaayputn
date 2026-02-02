const { PrismaClient } = require('@prisma/client');
const { createOrder, verifyPaymentSignature } = require('../services/paymentService');

const prisma = new PrismaClient();

const PLANS = {
    EMPLOYER: {
        BASIC: { amount: 49, limit: 15 },
        STANDARD: { amount: 99, limit: 25 }
    },
    JOBSEEKER: {
        BASIC: { amount: 49, limit: 15 },
        STANDARD: { amount: 99, limit: 25 }
    }
};

const initiateUpgrade = async (req, res) => {
    try {
        const { tier } = req.body; // 'BASIC' or 'STANDARD'
        const role = req.user.role;

        if (role === 'ADMIN') return res.status(400).json({ error: 'Admins cannot subscribe' });

        const plan = PLANS[role][tier];

        if (!plan) return res.status(400).json({ error: 'Invalid plan' });

        // Create Razorpay Order
        const order = await createOrder(plan.amount, 'INR', `sub_${req.user.id}_${Date.now()}`);

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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier } = req.body;

        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // Convert tier string to enum
        const tierEnum = tier === 'BASIC' ? 'BASIC' : 'STANDARD';
        const role = req.user.role;
        const plan = PLANS[role][tier];

        // Update Subscription
        const subscription = await prisma.subscription.update({
            where: { userId: req.user.id },
            data: {
                tier: tierEnum,
                isActive: true,
                // Update limits based on role
                jobPostsLimit: role === 'EMPLOYER' ? plan.limit : 10,
                contactsLimit: role === 'JOBSEEKER' ? plan.limit : 10,
                amount: plan.amount,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
