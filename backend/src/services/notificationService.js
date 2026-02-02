const OneSignal = require('onesignal-node');
const nodemailer = require('nodemailer');

const client = new OneSignal.Client({
    userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY || 'auth_key',
    app: {
        appAuthKey: process.env.ONESIGNAL_APP_AUTH_KEY || 'app_auth_key',
        appId: process.env.ONESIGNAL_APP_ID || 'app_id'
    }
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendPushNotification = async (userIds, title, message, data = {}) => {
    try {
        const notification = {
            contents: { en: message },
            headings: { en: title },
            include_external_user_ids: userIds, // Array of user IDs
            data: data
        };

        // Uncomment when keys are valid
        // const response = await client.createNotification(notification);
        // return response;
        console.log('Push Notification (Simulated):', { userIds, title, message });
        return { id: 'simulated_notification_id' };
    } catch (error) {
        console.error('Push notification error:', error);
    }
};

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending error:', error);
    }
};

module.exports = {
    sendPushNotification,
    sendEmail
};
