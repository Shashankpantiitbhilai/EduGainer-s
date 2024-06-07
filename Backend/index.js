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

require("dotenv").config();
const redis = require('redis');
const client = redis.createClient();
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
}));

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
