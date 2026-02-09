import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import chatReducer from './chatSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        chat: chatReducer,
        // job: jobReducer,
        // subscription: subscriptionReducer,
    },
});

export default store;
