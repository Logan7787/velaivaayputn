import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        // job: jobReducer,
        // subscription: subscriptionReducer,
    },
});

export default store;
