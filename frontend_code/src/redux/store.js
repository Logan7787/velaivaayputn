import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        // job: jobReducer,
        // subscription: subscriptionReducer,
    },
});

export default store;
