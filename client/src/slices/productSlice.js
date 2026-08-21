import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params || {}).toString();
    const { data } = await api.get(`/products?${query}`);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try { const { data } = await api.get(`/products/${id}`); return data.product; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], product: null, total: 0, pages: 1, loading: false, error: null },
  reducers: { clearProduct: (s) => { s.product = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.products; s.total = a.payload.total; s.pages = a.payload.pages; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProductById.pending, (s) => { s.loading = true; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.product = a.payload; })
      .addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  }
});
export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
