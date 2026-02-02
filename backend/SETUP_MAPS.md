# Maps Setup Guide (Free / No Credit Card Option)

Since you prefer not to add a payment method, we will use **OpenStreetMap (OSM)**. It is completely free and requires **no API key** for displaying maps on Android.

## 1. Update Backend Environment
You can ignore the `GOOGLE_MAPS_API_KEY` in your `.env` file or leave it blank. We won't be using Google's servers.

```env
# GOOGLE_MAPS_API_KEY=  <-- Leave this empty or commented out
```

## 2. Frontend Configuration (For Later)
When you are building the mobile app (in the `frontend_code` setup), we will configure the Map component to use **OSMDroid**.

**How it works (For your information):**
In `react-native-maps`, we will use the `PROVIDER_OSMDROID` property.

```javascript
/* Example of how the code will look later */
import MapView, { PROVIDER_OSMDROID } from 'react-native-maps';

<MapView
  provider={PROVIDER_OSMDROID} // <--- This switches to OpenStreetMap
  style={{ flex: 1 }}
  initialRegion={{...}}
/>
```

## 3. Geocoding (Convert Address to Coordinates)
If you need to turn an address (e.g., "Anna Nagar, Chennai") into coordinates (Latitude/Longitude) for the backend to save:

- We will use **Nominatim (OSM Geocoder)**.
- It is free and requires no key.
- **REST API URL**: `https://nominatim.openstreetmap.org/search?q=YOUR_ADDRESS&format=json`

**Summary**: You don't need to do anything right now! We have successfully switched the plan to use free alternatives.
