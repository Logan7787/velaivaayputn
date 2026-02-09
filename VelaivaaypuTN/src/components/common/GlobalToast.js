import React from 'react';
import { Snackbar, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/uiSlice';

const GlobalToast = () => {
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const { toast } = useSelector((state) => state.ui);

    const getBgColor = () => {
        switch (toast.type) {
            case 'success':
                return '#4CAF50';
            case 'error':
                return colors.error;
            default:
                return colors.primary;
        }
    };

    return (
        <Snackbar
            visible={toast.visible}
            onDismiss={() => dispatch(hideToast())}
            duration={3000}
            action={{
                label: 'Close',
                onPress: () => dispatch(hideToast()),
            }}
            style={{ backgroundColor: getBgColor() }}
        >
            {toast.message}
        </Snackbar>
    );
};

export default GlobalToast;
