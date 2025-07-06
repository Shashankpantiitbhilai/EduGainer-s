const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require("dotenv");

// Import configurations
const { connectDB } = require("./config/database");
const myPassport = require("./config/passport");

// Import routes
const apiRoutes = require("./routes/api");

dotenv.config();

const app = express();

// Environment configuration
const origin = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_PROD
  : process.env.FRONTEND_DEV;

// Create the server
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});

console.log(`Running in ${process.env.NODE_ENV} mode`);
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

// Connect to MongoDB
connectDB();

// Import cron jobs
require('./jobs/cronJobs');

// Body parser middleware
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Session configuration
const mode = process.env.NODE_ENV;

if (mode === "production") {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none'
    }
  }));
} else {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  }));
}

// Passport middleware
app.use(myPassport.initialize());
app.use(myPassport.session());

// API Routes
app.use("/", apiRoutes(io));

// Root route
app.get("/", (req, res) => {
  res.json("Hello");
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  // Handle joinRoom event
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on("joinSeatsRoom", (roomId) => {
    socket.join(roomId);
  });

  // Handle updateSeatStatus event
  socket.on('updateSeatStatus', async (data) => {
    const { id, status, seat, shift } = data;

    try {
      io.emit('seatStatusUpdate', { id, status, seat, shift });
    } catch (error) {
      console.error('Error updating seat status:', error);
      socket.emit('updateSeatStatusError', { error: 'Failed to update seat status' });
    }
  });

  // Handle sendMessage event
  socket.on('sendMessage', (messageData, roomId, sender) => {
    io.to(roomId).emit('receiveMessage', messageData, roomId, sender);
  });

  socket.on('onSeen', (roomId, messageId) => {
    socket.to(roomId).emit('messageSeen', { messageId, seenBy: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

module.exports = { app, server };
