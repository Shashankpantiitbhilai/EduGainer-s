const express = require("express");
const cors = require("cors");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const routes_admin = require("./routes/admin");
const routes_classes = require("./routes/classes");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./db");
const myPassport = require("./models/passportConfig"); // Adjust the path accordingly
const MongoStore = require('connect-mongo');
require("dotenv").config();

const app = express();

// Determine the origin based on the environment
const origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : 'https://edu-gainer-s-frontend-alpha.vercel.app';

console.log(`Running in ${process.env.NODE_ENV} mode`);

// CORS configuration
app.use(cors({
  origin,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable to include cookies
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
  secret: 'keyboard cat', // Use environment variable for session secret
  saveUninitialized: false, // Do not save uninitialized sessions
  resave: false, // Do not resave sessions that have not been modified
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions', // Optional: specify the collection name for sessions
    ttl: 14 * 24 * 60 * 60 // Optional: specify the time-to-live for sessions (14 days here)
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 // Optional: specify the cookie expiration time (1 day here)
  }
}));
console.log(process.env.MONGODB_URI)
// Passport middleware
app.use(myPassport.initialize());
app.use(myPassport.session());

// Mount your route handlers
app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/admin", routes_admin);
app.use("/classes", routes_classes);

app.get("/", (req, res) => {
  res.json("Hello");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
