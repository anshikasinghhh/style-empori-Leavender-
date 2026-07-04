import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import productReducer from './slices/productSlice';
import notificationReducer from './slices/notificationSlice';
import { initSocket } from './utils/socket';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    notifications: notificationReducer,
  },
});

// Initialize socket connection for real-time notifications
initSocket(store);
