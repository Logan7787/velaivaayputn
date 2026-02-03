const OneSignal = require('onesignal-node');

const sendBroadcastNotification = async (heading, content, data = {}) => {
    if (!process.env.ONESIGNAL_API_KEY || !process.env.ONESIGNAL_APP_ID) {
        console.warn('⚠️ OneSignal Keys missing. Skipping notification.');
        return;
    }

    try {
        const client = new OneSignal.Client(
            process.env.ONESIGNAL_APP_ID,
            process.env.ONESIGNAL_API_KEY
        );

        const notification = {
            headings: { 'en': heading },
            contents: { 'en': content },
            included_segments: ['Total Subscriptions'], // Sends to everyone
            data: data
        };

        const response = await client.createNotification(notification);
        console.log('✅ Notification Sent:', response.body);
        return response.body;
    } catch (error) {
        console.error('❌ OneSignal Error:', error);
        if (error.statusCode === 401) {
            console.error('Auth Error: Check ONESIGNAL_API_KEY in .env');
        }
    }
};

module.exports = {
    sendBroadcastNotification
};
