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
const MemoryStore = require('memorystore')(session);
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: ["https://edu-gainer-s-frontend.vercel.app"], // Replace with your frontend's URL
  credentials: true, // Enable credentials (e.g., cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Add all methods you will use
  // Add all headers you will use
};

app.use(cors(corsOptions));
// Enable pre-flight requests for all routes

// Connect to MongoDB
connectDB();


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: false,
  store: new MemoryStore({
    checkPeriod: 86400 // prune expired entries every 24h
  })
}));

app.use(myPassport.initialize());
app.use(myPassport.session());

// app.get("/", (_req, res) => {
//   res.redirect("https://edu-gainer-s-frontend.vercel.app");
// });

// Mount your route handlers
app.use("/", routes_general);
app.use("/auth", routes_auth);
app.use("/admin", routes_admin);
app.use("/classes", routes_classes);

// // Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
