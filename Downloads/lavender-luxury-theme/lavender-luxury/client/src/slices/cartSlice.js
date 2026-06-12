import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// CART SLICE
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/cart'); return data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const addToCart = createAsyncThunk('cart/add', async (item, { rejectWithValue }) => {
  try { const { data } = await api.post('/cart/add', item); return data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/cart/update/${itemId}`, { quantity }); return data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});
export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try { const { data } = await api.delete(`/cart/remove/${itemId}`); return data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearCart: (s) => { s.items = []; }
  },
  extraReducers: (builder) => {
    const setCart = (s, a) => { s.loading = false; s.items = a.payload?.items || []; };
    builder
      .addCase(fetchCart.pending, (s) => { s.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart);
  }
});
export const { clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
export default cartSlice.reducer;
