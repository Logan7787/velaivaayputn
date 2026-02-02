# Email Setup Guide (Gmail SMTP)

To send emails from your application using Gmail, you cannot use your regular login password. You must generate a special **App Password**.

## Prerequisites
- A Gmail account.
- **2-Step Verification** must be enabled on your Google Account.

## Step-by-Step Instructions

1.  **Go to Google Account Security**
    - Visit [https://myaccount.google.com/security](https://myaccount.google.com/security).
    - Ensure you are logged into the account you want to use for sending emails.

2.  **Enable 2-Step Verification** (if not already enabled)
    - Under "How you sign in to Google", click on **2-Step Verification**.
    - Follow the prompts to enable it (using your phone number or authenticator app).

3.  **Generate App Password**
    - Go to the search bar at the top of the page and search for **"App passwords"**.
      - *Note: If you don't see this option, ensure 2-Step Verification is enabled.*
    - Click on **App passwords**.
    - You may be asked to sign in again.
    - **App name**: Enter a name like "VelaivaaypuTN Backend".
    - Click **Create**.

4.  **Copy the Password**
    - Google will show you a 16-character password in a yellow box (e.g., `abcd efgh ijkl mnop`).
    - **Copy this password immediately**. You won't see it again.

5.  **Update your `.env` file**
    - Open `d:/VTN/backend/.env`.
    - Update the fields as follows:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=your-actual-email@gmail.com
```

- **EMAIL_USER**: Your full Gmail address.
- **EMAIL_PASSWORD**: The 16-character App Password you just copied (spaces are fine, or you can remove them).
- **EMAIL_FROM**: Use your email address again.

## Testing
Once updated, restart your backend server:
1. Press `Ctrl + C` in the backend terminal to stop it.
2. Run `npm run dev` again.
