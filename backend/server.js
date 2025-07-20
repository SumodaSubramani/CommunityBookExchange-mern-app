require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const db = 'mongodb://localhost:27017/bookExchangeDB';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

io.on('connection', (socket) => {
  
  console.log(`[BACKEND-INFO] User connected with socket ID: ${socket.id}`);

  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
    
    console.log(`[BACKEND-INFO] Socket ${socket.id} joined room: ${conversationId}`);
  });

  socket.on('sendMessage', async ({ conversationId, senderId, content }) => {
    
    console.log(`[BACKEND-RECEIVE] Message received from sender ${senderId} for conversation ${conversationId}. Content: "${content}"`);
    try {
      const newMessage = new Message({ conversationId, senderId, content });
      await newMessage.save();
      await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

      const populatedMessage = await Message.findById(newMessage._id).populate('senderId', 'username');

      
      console.log(`[BACKEND-BROADCAST] Broadcasting message to room: ${conversationId}`);
      io.to(conversationId).emit('receiveMessage', populatedMessage);

    } catch (error) {
      console.error("[BACKEND-ERROR] Error in sendMessage:", error);
    }
  });

  socket.on('disconnect', () => {
    
    console.log(`[BACKEND-INFO] User disconnected with socket ID: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));