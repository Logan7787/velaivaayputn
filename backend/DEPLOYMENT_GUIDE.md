# Deployment Guide (Going Online)

Currently, your app is running **Locally** (`localhost`).
- If you **turn off your laptop**, the server stops.
- If you **close the terminal**, the server stops.
- Your mobile app will verify "Network Error" because it can't find the server.

To make it work **24/7** (even when your laptop is off), you need to **Deploy** your backend and database to the cloud.

## Recommended Free/Cheap Services

### 1. Database (PostgreSQL)
**Service**: [Railway](https://railway.app/) or [Neon](https://neon.tech/) or [Supabase](https://supabase.com/)
1. Sign up.
2. Create a new **PostgreSQL** project.
3. Copy the `CONNECTION_STRING` (or `DATABASE_URL`).
4. Replace the `DATABASE_URL` in your `.env` file with this new cloud URL.
5. Run `npx prisma db push` to send your table structure to the cloud database.

### 2. Backend (Node.js API)
**Service**: [Render](https://render.com/) (Recommended for Free Tier)
1. Push your `backend` folder to **GitHub** (Done!).
2. Sign up for Render.
3. Click "New" -> "Web Service".
4. Connect your GitHub repository (`velaivaayputn`).
5. **Root Directory**: `backend` (Important! Don't leave this empty).
6. **Build Command**: `npm install`
7. **Start Command**: `node src/server.js`
8. **Environment Variables**:
   - Scroll down to "Environment Variables".
   - Add `DATABASE_URL` (Use your Supabase/Neon connection string here).
   - Add `JWT_SECRET`, `JWT_EXPIRE`.
   - Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
   - Add `PORT` = `5000` (Optional, Render assigns one automatically, but good to have).

### 3. Mobile App (Frontend)
1. Once the backend is deployed, you will get a URL like `https://velaivaayputn-backend.onrender.com`.
2. Go to your frontend code (`src/api/axios.config.js`).
3. Change `BASE_URL` from `http://10.0.2.2:5000` to `https://velaivaayputn-backend.onrender.com`.
4. Rebuild the app: `npx react-native run-android`.

Now, your app will talk to the **Cloud Server**. You can switch off your laptop, and the app will still work on your phone!
