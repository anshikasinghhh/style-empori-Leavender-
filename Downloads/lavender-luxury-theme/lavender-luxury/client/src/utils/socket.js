import { io } from 'socket.io-client';
import { addNotification } from '../slices/notificationSlice';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

let socket = null;
let store = null;

/**
 * Initialize socket connection and wire up event listeners.
 * Must be called after the Redux store is created.
 */
export const initSocket = (reduxStore) => {
  store = reduxStore;
  const token = localStorage.getItem('ve_token');

  if (!token) return;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true
  });

  socket.on('connect', () => {
    // Authenticate with server
    socket.emit('authenticate', token);
  });

  socket.on('new_notification', (notification) => {
    if (store) {
      store.dispatch(addNotification(notification));
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.log('Socket connection error:', err.message);
  });
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get socket instance
 */
export const getSocket = () => socket;
