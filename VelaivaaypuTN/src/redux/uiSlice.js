import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    toast: {
        visible: false,
        message: '',
        type: 'info', // 'success', 'error', 'info'
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.toast = {
                visible: true,
                message: action.payload.message,
                type: action.payload.type || 'info',
            };
        },
        hideToast: (state) => {
            state.toast.visible = false;
        },
    },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
