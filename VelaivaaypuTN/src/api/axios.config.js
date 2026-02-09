import axios from 'axios';
import store from '../redux/store';
import { showToast } from '../redux/uiSlice';

// Replace with your backend URL (e.g., http://10.0.2.2:5000 for Android Emulator)
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

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response, message } = error;

        if (response) {
            if (response.status === 401) {
                store.dispatch(showToast({ message: 'Session expired. Please login again.', type: 'error' }));
            } else if (response.status === 403) {
                store.dispatch(showToast({ message: 'Access denied. You do not have permission.', type: 'error' }));
            } else if (response.status >= 500) {
                store.dispatch(showToast({ message: 'Server error. Please try again later.', type: 'error' }));
            }
        } else if (message === 'Network Error') {
            store.dispatch(showToast({ message: 'No internet connection.', type: 'error' }));
        }

        return Promise.reject(error);
    }
);

export default api;
