import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMyChats, getChatMessages } from '../api/chatApi';

export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_, { rejectWithValue }) => {
        try {
            return await getMyChats();
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch conversations');
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (chatId, { rejectWithValue }) => {
        try {
            return await getChatMessages(chatId);
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        conversations: [],
        messages: {}, // { chatId: [messages] }
        loading: false,
        error: null,
        unreadCount: 0
    },
    reducers: {
        receiveMessage: (state, action) => {
            const { chatId, message } = action.payload;
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            // Avoid duplicates
            if (!state.messages[chatId].find(m => m.id === message.id)) {
                state.messages[chatId].push(message);
            }

            // Update conversation last message and timestamp
            const convIndex = state.conversations.findIndex(c => c.id === chatId);
            if (convIndex !== -1) {
                state.conversations[convIndex].messages = [message];
                state.conversations[convIndex].updatedAt = message.createdAt;
                // Move to top
                const conv = state.conversations.splice(convIndex, 1)[0];
                state.conversations.unshift(conv);
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const chatId = action.meta.arg;
                state.messages[chatId] = action.payload;
            });
    }
});

export const { receiveMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;
