# OneSignal Setup Guide (Free Push Notifications)

OneSignal is free for unlimited push notifications for up to 100,000 subscribers.

## Step-by-Step Instructions

1.  **Create an Account**
    - Go to [https://onesignal.com/](https://onesignal.com/) and Sign Up (e.g., "Web Push" or just "Sign Up Free").

2.  **Create a New App**
    - Click **Apps** (top menu) -> **New App/Website**.
    - **Name**: "VelaivaaypuTN".
    - **Platform**: Select **Google Android (FCM)**.
        - *Note: Since we are just setting up keys right now, if it asks for Firebase keys, you can temporarily select "Web" to bypass it, or just pause here. The important part is getting the App ID.*
        - *Better option:* Just select "Google Android". It will ask for "Firebase Server Key".
        - **If you don't have Firebase yet**:
            1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/).
            2. Create project "VelaivaaypuTN".
            3. Project Settings -> Cloud Messaging -> Copy **Server Key**.
            4. Paste that into OneSignal.

3.  **Get App Keys (App ID & App Auth Key)**
    - In your OneSignal Dashboard, go to **Settings** -> **Keys & IDs**.
    - **OneSignal App ID**: Copy this UUID (e.g., `123e4567-e89b...`).
    - **Rest API Key**: This is your `ONESIGNAL_APP_AUTH_KEY`.

4.  **Get User Auth Key**
    - Click your **Profile Icon** (top right corner).
    - Select **Account & API Keys**.
    - Scroll down to "User Authorization Key".
    - Copy this key. This is your `ONESIGNAL_USER_AUTH_KEY`.

## Update your `.env`

```env
ONESIGNAL_APP_ID=YOUR_COPIED_APP_ID
ONESIGNAL_APP_AUTH_KEY=YOUR_COPIED_REST_API_KEY
ONESIGNAL_USER_AUTH_KEY=YOUR_COPIED_USER_AUTH_KEY
```

> **Note**: These keys allow your backend to SEND notifications to your mobile app users automatically.
