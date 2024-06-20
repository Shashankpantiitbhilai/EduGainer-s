const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')
const {
  Student,

  User,
} = require("../models/student");
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
  const { password, email } = req.body;

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
    console.log(userDetails)
    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${sentOTP}`
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
  const { otp, id } = req.body;

  try {
    // Check if Redis client is connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log(id, otp)
    // Retrieve OTP from Redis
    const userDetails = await redisClient.get(id);
    if (!userDetails) {
      return res.status(400).json({ message: "Invalid OTP or user details not found" });
    }
    console.log(userDetails)
    const { otp: storedOTP, password } = JSON.parse(userDetails);

    if (otp === storedOTP) {
      // OTP verified, register user using Passport
      const newUser = await User.register(
        new User({ strategy: "local", username: id }),
        password
      );

      // Log in the new user
      req.login(newUser, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal Server Error" });
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("New hashed password:", hashedPassword);

    // Retrieve the user before updating the password
    const userBeforeUpdate = await User.findById(id);
    console.log("User before update:", userBeforeUpdate);

    // Update the user's password in the database
    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword });

    console.log("Updated user:", updatedUser);

    if (updatedUser) {
      // Send a success response if the user was updated
      res.json({ success: true, message: "Password reset successfully" });
    } else {
      // If the user was not found, send an error response
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    // Handle errors
    if (error.name === "JsonWebTokenError") {
      res.status(400).json({ success: false, message: "Error with token" });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  User.findOne({ username: email })

    .then(user => {
      console.log(user);
      if (!user) {
        return res.send({ Status: "User not existed" });
      }
      // console.log(user);
      const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });


      var mailOptions = {
        from: 'shashankpant94115@gmail.com',
        to: email,
        subject: 'Reset Password Link',
        text: `https://edu-gainer-s-frontend-alpha.vercel.app/reset-password/${user._id}/${token}`
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
  console.log(req.session)
  console.log("fetch",req.user)
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

// Local Authentication
router.post("/login", passport.authenticate("local"), (req, res) => {

  const { email, password } = req.body;
  console.log(req.body);
  if (email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {

    res.status(201).json({ message: "ADMIN Login is successful", user: req.user });




  }

  else {
    res.status(200).json({ message: "User Login is successful", user: req.user });
  }
});



// Google OAuth Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/verify",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user.ID_No) {
      res.redirect("/auth/google/addId");
    } else {
      res.redirect("/");
    }
  },
);

router.get("/google/addId", (req, res) => {
  // TODO: Find a more secure url
  res.redirect(`https://edu-gainer-s-frontend-alpha.vercel.app/register/google/${req.user._id}`);
});

router.post("/google/register", async (req, res) => {
  const { id, ID_No } = req.body;
  console.log(req.user);

  if (id == req.user.id) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { ID_No: ID_No },
        { new: true },
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Serialize the updated user into the session
      req.login(user, function (err) {
        if (err) {
          console.error("Error serializing user:", err);
          return res.status(500).json({ message: "Error serializing user" });
        }
      });
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("Logout Successful");
  });
});



module.exports = router;
