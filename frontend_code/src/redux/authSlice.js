import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi, getMe as getMeApi } from '../../api/authApi';
import { setAuthToken } from '../../api/axios.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        const data = await loginApi(email, password);
        setAuthToken(data.token);
        await AsyncStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return rejectWithValue('No token');
        setAuthToken(token);
        const data = await getMeApi();
        return { user: data, token };
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to load user');
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
    await AsyncStorage.removeItem('token');
    setAuthToken(null);
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isAuthenticated: false,
        loading: true,
        user: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.isAuthenticated = false;
                state.user = null;
            });
    }
});

export default authSlice.reducer;
