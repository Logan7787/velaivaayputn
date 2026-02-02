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
**Service**: [Render](https://render.com/) or [Railway](https://railway.app/)
1. Push your `backend` folder to **GitHub**.
2. Sign up for Render/Railway.
3. specific "New Web Service" and connect your GitHub repo.
4. **Build Command**: `npm install`
5. **Start Command**: `node src/server.js`
6. **Environment Variables**: Copy all variables from your `.env` file (DATABASE_URL, JWT_SECRET, etc.) into the service dashboard key-value pairs.

### 3. Mobile App (Frontend)
1. Once the backend is deployed, you will get a URL like `https://velaivaayputn-backend.onrender.com`.
2. Go to your frontend code (`src/api/axios.config.js`).
3. Change `BASE_URL` from `http://10.0.2.2:5000` to `https://velaivaayputn-backend.onrender.com`.
4. Rebuild the app: `npx react-native run-android`.

Now, your app will talk to the **Cloud Server**. You can switch off your laptop, and the app will still work on your phone!
