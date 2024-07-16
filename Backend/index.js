const express = require("express");
const cors = require("cors");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const routes_admin = require("./routes/admin");
const routes_classes = require("./routes/classes");
const routes_quiz = require("./routes/quiz");
const routes_chat = require("./routes/chat");
const routes_library = require("./routes/Library");
const routes_admin_library = require("./routes/admin_lib");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./db");
const myPassport = require("./models/passportConfig");
const http = require('http');
const socketIO = require('socket.io');
const redis = require('redis');
const client = redis.createClient();
const app = express();
const dotenv = require("dotenv")
dotenv.config()
// console.log(process.env.FRONTEND_DEV)
const origin = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_PROD
  : process.env.FRONTEND_DEV

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
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Session configuration
const mode = process.env.NODE_ENV;
// console.log(process.env.SESSION_SECRET)

if (mode === "production") {
  app.use(session({
    secret: process.env.SESSION_SECRET, // Use environment variable for session secret
    saveUninitialized: true, // Do not save uninitialized sessions
    resave: false,
    proxy: true,
    cookie: {
      secure: true, // Ensure cookies are only sent over HTTPS
      httpOnly: true, // Cookies are not accessible via JavaScript
      sameSite: 'none' // Allow cross-site cookies
    }
  }));
}
else {
  app.use(session({
    secret: process.env.SESSION_SECRET, // Use environment variable for session secret
    saveUninitialized: true, // Do not save uninitialized sessions
    resave: false,
  }))
}
app.use(myPassport.initialize());
app.use(myPassport.session());

app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/admin", routes_admin);
app.use("/classes", routes_classes);
app.use("/library", routes_library);
app.use("/admin_library", routes_admin_library);
// Pass Socket.IO instance to chat routes
app.use("/chat", routes_chat(io));

app.get("/", (req, res) => {
  res.json("Hello");
});

// User ID to socket ID mapping


io.on('connection', (socket) => {

  // Handle joinRoom event
  socket.on('joinRoom', (roomId) => {
    console.log(`User ${socket.id} joining room ${roomId}`);
    socket.join(roomId);
  });


  socket.on('updateSeatStatus', async (data) => {
    const { id, status } = data;

  

    // Optionally, broadcast the updated booking status to all connected clients
    io.emit('seatStatusUpdate', { id, status });
  })
  
  // Handle sendMessage event
  socket.on('updateSeatStatus', (messageData, roomId) => {

    console.log("messagedata", messageData);
    const { messages, user } = messageData;
    console.log(`Message received in room ${messages[0].receiver}: ${messages[0].content}`);

    // Broadcast the message to all clients in the room
    io.to(roomId).emit('receiveMessage', messageData, roomId);
  });
  socket.on('sendMessage', (messageData, roomId) => {

    console.log("messagedata", messageData);
    const { messages, user } = messageData;
    console.log(`Message received in room ${messages[0].receiver}: ${messages[0].content}`);

    // Broadcast the message to all clients in the room
    io.to(roomId).emit('receiveMessage', messageData, roomId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
