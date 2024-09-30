const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')
const {
  LibStudent,

  User,
} = require("../models/student");
const {

  AdminClass,
} = require("../models/classes");
const passport = require("../models/passportConfig");
const { connectDB, closeDB } = require("../db");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
const redisClient = require('../redis'); // Assuming redis client setup in separate file


router.post("/register", async (req, res) => {
  let { password, email } = req.body;
  email = email.toLowerCase();
  try {
    // Check if Redis client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ username: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const sentOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    const userDetails = JSON.stringify({ password, otp: sentOTP });


    // Store the object in Redis with a TTL (Time-To-Live)
    await redisClient.set(email, userDetails, 'EX', 30000);
    // console.log(userDetails)
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'EduGainer\'s Classes: OTP Verification',
      text: `Dear Student,

Your  (OTP) for registration is: ${sentOTP}



`
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending OTP email" });
      } else {
        return res.status(200).json({ message: "OTP sent successfully", email });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post("/otp-verify", async (req, res) => {
  let { otp, id } = req.body;
  id = id.toLowerCase();
  try {
    // Check if Redis client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Retrieve OTP from Redis

    const userDetails = await redisClient.get(id);
    if (!userDetails) {
      return res.status(400).json({ message: "Invalid OTP or user details not found" });
    }

    const { otp: storedOTP, password } = JSON.parse(userDetails);

    if (otp === storedOTP) {
      // OTP verified, register user using Passport
      const newUser = await User.register(
        new User({ strategy: "local", username: id }),
        password
      );

      // Log in the new user
      req.login(newUser, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        const emailRegex = new RegExp(`^\\s*${id}\\s*$`, 'i');


        // Find LibStudent by email
        const libStudent = await LibStudent.findOne({ email: emailRegex });
        if (libStudent) {

          // Update LibStudent with userId
          libStudent.userId = newUser?._id;
          await libStudent.save();

        }

        // Respond with success message and new user object
        res.status(201).json({ message: "User registered successfully", user: newUser });
      });
    } else {
      // OTP verification failed
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, "jwt_secret_key");

    // Retrieve the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Use Passport-Local Mongoose's setPassword method
    await user.setPassword(password);
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(400).json({ success: false, message: "Error with token" });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});
router.post("/forgot-password", (req, res) => {
  let { email } = req.body;
  email = email.toLowerCase();
  User.findOne({ username: email })

    .then(user => {
      // console.log(user);
      if (!user) {
        return res.send({ Status: "User not existed" });
      }
      // console.log(user);
      const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });

      const url = process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_PROD
        : process.env.FRONTEND_DEV
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Password Link',
        html: `
          <p>Dear Student,</p>
          <p>Click the following link to reset your password:</p>
          <a href="${url}/reset-password/${user._id}/${token}">Reset Password Link</a>
        `
      };


      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(500).send({ Status: "Error sending email" });
        } else {
          res.send({ Status: "Success" });
        }
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ Status: "Internal Server Error" });
    });
});
router.get("/fetchAuth", function (req, res) {

  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

// Local Authentication
router.post("/login", passport.authenticate("local"), async (req, res) => {




  const { email, password } = req.body;

  const emailRegex = new RegExp(`^\\s*${email}\\s*$`, 'i');


  // Find LibStudent by email
  const libStudent = await LibStudent.findOne({ email: emailRegex });
  const classStudent = await AdminClass.findOne({ email: emailRegex });
  if (libStudent) {

    // Update LibStudent with userId
    libStudent.userId = req.user._id;
    await libStudent.save();

  }
  if (classStudent) {

    // Update LibStudent with userId
    classStudent.userId = req.user._id;
    await classStudent.save();

  }
  // console.log(req.body);
  if (email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {

    res.status(201).json({ message: "ADMIN Login is successful", user: req.user });




  }

  else {
    res.status(200).json({ message: "User Login is successful", user: req.user });
  }
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after successful authentication
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?auth_success=false' }),
  async (req, res) => {
    // Successful authentication

    const frontendUrl =
      process.env.NODE_ENV === 'production'
        ? `${process.env.FRONTEND_PROD}`
        : `${process.env.FRONTEND_DEV}`

    // Prepare user info
    // console.log("ncjcnd", req.user)
    const userInfo = {
      ...req.user._doc,

      // Assuming you have a way to determine the user's role
    };

    const emailRegex = new RegExp(`^\\s*${userInfo.username}\\s*$`, 'i');

    const libStudent = await LibStudent.findOne({ email: emailRegex });
    const classStudent = await AdminClass.findOne({ email: emailRegex });
    if (libStudent) {

      // Update LibStudent with userId
      libStudent.userId = userInfo._id;

      await libStudent.save();

    }
    if (classStudent) {

      // Update LibStudent with userId
      classStudent.userId = req.user._id;
      await classStudent.save();

    }
    // Encode and stringify user info
    const encodedUserInfo = encodeURIComponent(JSON.stringify(userInfo));

    res.redirect(`${frontendUrl}/login?auth_success=true&user_info=${encodedUserInfo}`);
  }
);
// Google OAuth Authentication


router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Logout Successful");
  });
});



module.exports = router;
