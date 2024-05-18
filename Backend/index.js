const express = require("express");
// eslint-disable-next-line node/no-unpublished-require
const cors = require("cors");
const routes_auth = require("./routes/auth");
const routes_general = require("./routes/route");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./db");
const myPassport = require("./models/passportConfig"); // Adjust the path accordingly
const MemoryStore = require('memorystore')(session)
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true, // Enable credentials (e.g., cookies)
};

app.use(cors(corsOptions));

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

app.get("/", (_req, res) => {
  res.redirect("http://localhost:3000");
});

// Mount your route handlers
app.use("/", routes_general);
app.use("/auth", routes_auth);

// Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`connected to port ${process.env.PORT || 8000}`);
});
