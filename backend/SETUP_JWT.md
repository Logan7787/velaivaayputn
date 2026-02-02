# JWT Secret Setup Guide

Unlike the Email or Payment keys, **JWT Secrets are not provided by a third party.** You generate them yourself!

## What are they?
These are secret "passwords" that your backend uses to sign and verify authentication tokens. If someone guesses these secrets, they can forge login tokens and hack your users' accounts.

## How to get them?
You just need to create two long, random, and complicated strings.

### Option 1: The "Mash Keyboard" Method (Easiest)
Just type a very long, random sentence or string of characters.
**Example:**
`JWT_SECRET=super_secret_random_string_that_nobody_can_guess_12345!`
`JWT_REFRESH_SECRET=another_super_secret_random_string_for_refresh_98765!`

### Option 2: The "Professional" Method (Recommended)
You can use Node.js to generate a cryptographically strong random string.

1. Open a terminal.
2. Type `node` and press Enter to enter the Node.js console.
3. Paste this command and press Enter:
   ```javascript
   require('crypto').randomBytes(64).toString('hex')
   ```
4. Copy the long output string (it will look like `a1b2c3d4...`).
5. Paste it as your `JWT_SECRET`.
6. Run the command again to get a *different* string for `JWT_REFRESH_SECRET`.

## Update your `.env`
Your final `.env` should look something like this:

```env
JWT_SECRET=d33055b4a5d8e9f... (your generated string)
JWT_REFRESH_SECRET=7c9a1b2d3e4f... (your other generated string)
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
```
