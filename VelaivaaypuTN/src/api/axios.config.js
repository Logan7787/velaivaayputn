import axios from 'axios';

// Replace with your backend URL (e.g., http://10.0.2.2:5000 for Android Emulator)
// For Physical Device on Wi-Fi (Same Network)
const BASE_URL = 'https://velaivaayputn.onrender.com/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
