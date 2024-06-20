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


const origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://edu-gainer-s-frontend-alpha.vercel.app';

// // Create the server
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
  secret: 'keyboard cat', // Use environment variable for session secret
  saveUninitialized: true, // Do not save uninitialized sessions
  resave: false,
  proxy: true,
  cookie: {
    secure: true, // Ensure cookies are only sent over HTTPS
    httpOnly: true, // Cookies are not accessible via JavaScript
    sameSite: 'none' // Allow cross-site cookies
  }
}));

app.use(myPassport.initialize());
app.use(myPassport.session());

app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/admin", routes_admin);
app.use("/classes", routes_classes);
// app.use("/quiz", routes_quiz);

// Pass Socket.IO instance to chat routes
app.use("/chat", routes_chat(io));

app.get("/", (req, res) => {
  res.json("Hello");
});

// User ID to socket ID mapping


io.on('connection', (socket) => {
  const userId = socket.handshake.query.sender;
  const adminId = socket.handshake.query.admin;

  // Handle joinRoom event
  socket.on('joinRoom', (roomId) => {
    console.log(`User ${socket.id} joining room ${roomId}`);
    socket.join(roomId);
  });



  // Handle sendMessage event
  socket.on('sendMessage', (messageData, roomId) => {
    console.log("messagedata", messageData);
    const { messages, user } = messageData;
    console.log(`Message received in room ${messages[0].receiver}: ${messages[0].content}`);
    console.log(roomId)
    // Broadcast the message to all clients in the room
    io.to(roomId).emit('xyz', messageData, roomId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
