const express = require("express");
const cors = require("cors");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const routes_admin = require("./routes/admin");
const routes_classes = require("./routes/classes");
const routes_quiz = require("./routes/quiz");
const routes_chat = require("./routes/chat");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./db");
const myPassport = require("./models/passportConfig");
const http = require('http');
const socketIO = require('socket.io');
const redis = require('redis');
const client = redis.createClient();
const app = express();
app.use(require('express-status-monitor')());

const origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://edu-gainer-s-frontend-alpha.vercel.app';

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

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  saveUninitialized: true,
  resave: false,
  // proxy: true,
}));

app.use(myPassport.initialize());
app.use(myPassport.session());

app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/admin", routes_admin);
app.use("/classes", routes_classes);
app.use("/quiz", routes_quiz);

// Pass Socket.IO instance to chat routes
app.use("/chat", routes_chat(io));

app.get("/", (req, res) => {
  res.json("Hello");
});

// User ID to socket ID mapping
const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  // Assuming you get the user ID from the client's query or a handshake header
  const userId = socket.handshake.query.sender;
  if (userId) {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID ${socket.id} : ${userId}  ${userSocketMap[userId]}`);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (userId) {
      userSocketMap.delete(userId);
      console.log(`User ${userId} disconnected and removed from map`);
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
