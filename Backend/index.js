const express = require("express");
const cors = require("cors");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const routes_admin = require("./routes/admin");
const routes_classes = require("./routes/classes");
const routes_quiz = require("./routes/quiz");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./db");
const myPassport = require("./models/passportConfig"); // Adjust the path accordingly
const http = require('http');
const socketIO = require('socket.io');
const { Message } = require("./models/chat");
require("dotenv").config();
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

// Enable pre-flight requests for all routes
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
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none'
  }
}));

// Passport middleware
app.use(myPassport.initialize());
app.use(myPassport.session());

// Mount your route handlers
app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/admin", routes_admin);
app.use("/classes", routes_classes);
app.use("/quiz", routes_quiz);
app.get("/", (req, res) => {
  res.json("Hello");
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async (data) => {
    // console.log(data,"in server")
    const { sender, receiver, message } = data;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    const res = Message.find({});
    console.log(res)
    io.emit('receiveMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
