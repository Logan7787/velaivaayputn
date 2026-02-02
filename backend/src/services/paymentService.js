const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

const createOrder = async (amount, currency = 'INR', receipt) => {
    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt
        };
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw error;
    }
};

const verifyPaymentSignature = (orderId, paymentId, signature) => {
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + '|' + paymentId)
        .digest('hex');

    return generatedSignature === signature;
};

module.exports = {
    createOrder,
    verifyPaymentSignature,
    razorpay
};
