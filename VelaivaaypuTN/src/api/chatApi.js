import api from './axios.config';

export const initiateChat = async (jobId, employerId) => {
    const response = await api.post('/chat/initiate', { jobId, employerId });
    return response.data;
};

export const getMyChats = async () => {
    const response = await api.get('/chat/my-chats');
    return response.data;
};

export const getChatMessages = async (chatId) => {
    const response = await api.get(`/chat/${chatId}/messages`);
    return response.data;
};
