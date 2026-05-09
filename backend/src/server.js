const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MONGODB CONNECTION ERROR:');
    console.error(err);
  });

// Socket.io context for controllers
app.set('io', io);

// Routes
app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('joinRoom', (bookingId) => {
    socket.join(bookingId);
    console.log(`👤 User joined room: ${bookingId}`);
    
    // Send a welcome message from the mentor for demo purposes
    setTimeout(() => {
      io.to(bookingId).emit('receiveMessage', {
        message: "Hello! I am here to help you. How can I assist you today?",
        sender: "Mentor",
        timestamp: new Date().toISOString()
      });
    }, 500);
  });

  socket.on('sendMessage', ({ bookingId, message, sender }) => {
    console.log(`📩 Message from ${sender} in room ${bookingId}: ${message}`);
    const timestamp = new Date().toISOString();
    io.to(bookingId).emit('receiveMessage', { message, sender, timestamp });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
