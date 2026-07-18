const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const allowedOrigins = [
  "http://localhost:3000",
  "https://onlinelavender.com",
  "https://www.onlinelavender.com",
  process.env.CLIENT_URL
].filter(Boolean);


app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});
// ------const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     credentials: true
//   }
// });

// Make io accessible to routes
app.set('io', io);

// Track connected users
const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Authenticate socket connection
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      userSocketMap[userId] = socket.id;
      socket.join(`user:${userId}`);
      console.log(`User ${userId} authenticated on socket ${socket.id}`);
    } catch (err) {
      console.error('Socket auth failed:', err.message);
    }
  });

  socket.on('disconnect', () => {
    // Remove from map
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    console.log('Socket disconnected:', socket.id);
  });
});
// Middleware
// ------app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true
// }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use("/api/chat", chatRoutes);
app.use('/api/shiprocket', require('./routes/shiprocket'));

// Employee Management routes
app.use('/api/employee/attendance', require('./routes/attendance'));
app.use('/api/employee/tasks', require('./routes/tasks'));
app.use('/api/employee/inventory-requests', require('./routes/inventoryRequests'));
app.use('/api/employee/admin', require('./routes/employeeAdmin'));
app.use('/api/loyalty-settings', require('./routes/loyaltySettings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/flash-sales', require('./routes/flashSales'));
app.use('/api/uploads', require('./routes/uploads'));
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vastra Elegance API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/vastra-elegance';

const connectToDatabase = async () => {
  const urls = [MONGODB_URI, LOCAL_MONGODB_URI].filter(Boolean);

  for (const url of urls) {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log(`✅ Connected to MongoDB: ${url}`);
      return;
    } catch (err) {
      console.error(`❌ Failed to connect to MongoDB at ${url}:`, err.message);
    }
  }

  throw new Error('Unable to connect to any MongoDB instance. Check MONGODB_URI or run a local MongoDB server.');
};

const removeGiftCardCollections = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    for (const collectionName of ['giftcards', 'giftcardtiers']) {
      try {
        await db.dropCollection(collectionName);
        console.log(`🗑️ Dropped gift-card collection: ${collectionName}`);
      } catch (err) {
        if (err.code !== 26) {
          console.warn(`⚠️ Could not drop ${collectionName}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Gift-card cleanup skipped:', err.message);
  }
};

const seedDefaultUsers = async () => {
  const defaultUsers = [
    { name: 'Admin User', email: 'admin@vastra.com', password: 'admin123', role: 'admin' },
    { name: 'Customer User', email: 'customer@vastra.com', password: 'customer123', role: 'customer' },
    { name: 'Employee User', email: 'employee@vastra.com', password: 'employee123', role: 'employee' }
  ];

  for (const userData of defaultUsers) {
    const existing = await User.findOne({ email: userData.email });
    if (!existing) {
      await User.create(userData);
      console.log(`✅ Created default user: ${userData.email}`);
    }
  }
};

const startServer = async () => {
  try {
    await connectToDatabase();
    await removeGiftCardCollections();
    await seedDefaultUsers();
  } catch (err) {
    console.error('❌ MongoDB startup failed:', err.message);
    console.warn('⚠️ The server is starting up, but database operations will fail until MongoDB is reachable.');
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

module.exports = { app, server, io };
