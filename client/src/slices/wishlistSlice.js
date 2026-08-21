import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// WISHLIST SLICE
export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/wishlist'); return data.wishlist; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
  try { const { data } = await api.post(`/wishlist/toggle/${productId}`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { products: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (s, a) => { s.products = a.payload?.products || []; })
      .addCase(toggleWishlist.fulfilled, (s, a) => { s.products = a.payload?.wishlist?.products || []; });
  }
});
export const wishlistReducer = wishlistSlice.reducer;
export default wishlistSlice.reducer;
