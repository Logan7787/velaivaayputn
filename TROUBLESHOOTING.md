# Troubleshooting Guide

## 🔴 Error: "Unable to load script" (Red Screen)
This means your phone/emulator cannot connect to the "Metro Bundler" (the server that provides the JavaScript code).

### Solution
1. **Keep the Metro Terminal Open**
   You need a separate terminal window running:
   ```bash
   cd d:\VTN\VelaivaaypuTN
   npx react-native start
   ```
   *Do not close this window!*

2. **Connect the Port (ADB Reverse)**
   If you are on an Emulator or USB device, run this in another terminal:
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

3. **Reload the App**
   - Press `R` twice on your keyboard (if using Emulator).
   - Or shake the device -> "Reload".

## ❌ Error: "Database connection failed" (Render)
If your backend isn't working on the cloud:
1. Check your **Render Environment Variables**.
2. Make sure `DATABASE_URL` starts with `postgresql://` (not just `postgres://` or `db...`).
3. Make sure you don't have spaces in your keys.

## 🐛 App Crashing on Startup?
1. Ensure your backend is running (`npm run dev`).
2. If using a physical device, make sure your phone and laptop are on the **SAME WiFi**.
3. Update `src/api/axios.config.js` to use your computer's IP address instead of `10.0.2.2`.
