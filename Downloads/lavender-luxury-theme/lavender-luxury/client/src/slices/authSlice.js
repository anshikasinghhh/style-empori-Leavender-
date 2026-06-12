import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('ve_token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('ve_token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: localStorage.getItem('ve_token'), loading: false, error: null, initialized: false },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('ve_token');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload.user; s.initialized = true; })
      .addCase(fetchMe.rejected, (s) => { s.token = null; s.initialized = true; localStorage.removeItem('ve_token'); });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
