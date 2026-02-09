import api from './axios.config';

export const getAdminStats = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const toggleUserStatus = async (userId) => {
    const response = await api.post('/admin/users/toggle-status', { userId });
    return response.data;
};

export const getPendingVerifications = async () => {
    const response = await api.get('/admin/verifications/pending');
    return response.data;
};

export const verifyUser = async (userId, isVerified = true) => {
    const response = await api.patch(`/admin/users/${userId}/verify`, { isVerified });
    return response.data;
};
