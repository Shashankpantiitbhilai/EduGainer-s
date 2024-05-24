const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { restrictToPresident, restrictToAdmin } = require("../middlewares");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator')
const {
  Student,
  ScietechPOR,
  CultPOR,
  SportsPOR,
  AcadPOR,
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
        text: `http://localhost:3000/reset-password/${user._id}/${token}`
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
router.post("/login", passport.authenticate("local"), (req, res) => {
 
  const { email, password } = req.body;
  if (email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {
   
    res.status(201).json({ message: "ADMIN Login is successful", user: req.user });




  }

  else {
    res.status(200).json({ message: "User Login is successful", user: req.user });
  }
});

router.post("/register", async (req, res) => {
  const { password, email } = req.body;

  console.log(req.body);
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ username: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const sentOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    req.session.sentOTP = sentOTP;
    req.session.email = email;
    req.session.password = password;
    // console.log(req.session);
    // Send email with OTP
    const mailOptions = {
      from: 'shashankpant94115@gmail.com',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is: ${sentOTP}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending OTP email" });
      } else {
        return res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to verify OTP and register user
// Route to verify OTP and register user
router.post("/otp-verify", async (req, res) => {
  const { otp } = req.body;
  const sentOTP = req.session.sentOTP;
  const email = req.session.email;
  const password = req.session.password;
  // console.log(req.session);
  console.log(otp, sentOTP);
  try {
    // Assuming sentOTP is defined somewhere
    if (otp === sentOTP) {

      // OTP verified, register user using Passport
      const newUser = await User.register(
        new User({ strategy: "local", username: email }),
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
  res.redirect(`http://localhost:3000/register/google/${req.user._id}`);
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

// module.exports = router;

// router.get("/", restrictToPresident, function (req, res) {
//   try {
//     // const jwtToken = req.cookies.credentials;
//     // const user = JSON.parse(req.headers['user-details']);
//     // const decoded = jwt_decode(jwtToken);

//     const { username, password } = req.DB_credentials;
//     const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
//     mongoose
//       .connect(dbUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then(async () => {
//         console.log("Connected to MongoDB234");
//         console.log("done");
//         return res
//           .status(201)
//           .json({ success: true, message: "Student Added Successfully" });
//       })
//       .catch((error) => {
//         console.error("MongoDB connection error:", error);
//         return res
//           .status(500)
//           .json({ success: false, message: "MongoDB connection error" });
//       });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error" });
//   }
// });

// router.post("/add", restrictToPresident, async (req, res) => {
//   try {
//     // const jwtToken = req.cookies.credentials;
//     // const user = JSON.parse(req.headers['user-details']);
//     // const decoded = jwt_decode(jwtToken);

//     const { username, password } = req.DB_credentials;
//     const student = new Student({
//       name: req.body.name,
//       ID_No: req.body.ID_No,
//       Program: req.body.Program,
//       discipline: req.body.discipline,
//       pos_res: req.body.pos_res,
//       add_year: req.body.add_year,
//     });
//     const pors = req.body.pos_res;

//     const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
//     mongoose
//       .connect(dbUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then(async () => {
//         const st = await student.save();
//         pors.forEach((element) => {
//           if (element.type == "AcademicPOR") {
//             const acad_por = new AcadPOR({
//               student: st,
//               club: element.club,
//               designation: element.designation,
//               session: element.session,
//             });
//             acad_por.save();
//           }
//           if (element.type == "CulturalsPOR") {
//             const cult_por = new CultPOR({
//               student: st,
//               club: element.club,
//               designation: element.designation,
//               session: element.session,
//             });
//             cult_por.save();
//           }
//           if (element.type == "SportsPOR") {
//             const sport_por = new SportsPOR({
//               student: st,
//               club: element.club,
//               designation: element.designation,
//               session: element.session,
//             });
//             sport_por.save();
//           }
//           if (element.type == "ScitechPOR") {
//             const scitech_por = new ScietechPOR({
//               student: st,
//               club: element.club,
//               designation: element.designation,
//               session: element.session,
//             });

//             scitech_por.save();
//             console.log(scitech_por);
//           }
//         });
//         mongoose.connection.close();
//         console.log("MongoDB connection closed");
//         return res
//           .status(201)
//           .json({ success: true, message: "Student Added Successfully" });
//       })
//       .catch((error) => {
//         console.error("MongoDB connection error:", error);
//       });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ success: false, message: "process failed" });
//   }
// });

// router.post("/remove", restrictToPresident, async (req, res) => {
//   try {
//     // const jwtToken = req.cookies.credentials;
//     // const user = JSON.parse(req.headers['user-details']);
//     // const decoded = jwt_decode(jwtToken);

//     const { username, password } = req.DB_credentials;

//     const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
//     mongoose
//       .connect(dbUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then(async () => {
//         console.log("Connected to MongoDB234");
//         const student = await Student.findOne({ ID_No: req.body.ID_No });
//         await Student.findByIdAndDelete(student._id);
//         mongoose.connection.close();
//         return res
//           .status(200)
//           .json({ success: true, message: "Student Deleted Successfully" });
//       })
//       .catch((error) => {
//         console.error("MongoDB connection error:", error);
//       });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ success: false, message: "process failed" });
//   }
// });

// router.post("/update", restrictToAdmin, async (req, res) => {
//   try {
//     // const decoded = req.decoded;

//     const { username, password, User } = req.DB_credentials;
//     const data = req.body.data;
//     const stud = data.student;
//     const PORs = req.body.editedData.PORS;

//     console.log(PORs);
//     const dbUri = `mongodb+srv://${username}:${password}@cosa-database.xypqv4j.mongodb.net/?retryWrites=true&w=majority`;
//     await mongoose
//       .connect(dbUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       })
//       .then(async () => {
//         const student = await Student.findById(stud._id).exec();
//         console.log(student);
//         if (User == "President") {
//           for (const element of PORs) {
//             if (element.type == "Scitech-POR") {
//               await ScietechPOR.findByIdAndUpdate(
//                 element._id,
//                 {
//                   student: student,
//                   club: element.club,
//                   designation: element.designation,
//                   session: element.session,
//                 },
//                 { new: true, upsert: true },
//               ).exec();
//             } else if (element.type == "Cult-POR") {
//               await CultPOR.findByIdAndUpdate(
//                 element._id,
//                 {
//                   student: student,
//                   club: element.club,
//                   designation: element.designation,
//                   session: element.session,
//                 },
//                 { new: true, upsert: true },
//               ).exec();
//             } else if (element.type == "Sport-POR") {
//               await SportsPOR.findByIdAndUpdate(
//                 element._id,
//                 {
//                   student: student,
//                   club: element.club,
//                   designation: element.designation,
//                   session: element.session,
//                 },
//                 { new: true, upsert: true },
//               ).exec();
//             } else if (element.type == "Acad-POR") {
//               await AcadPOR.findByIdAndUpdate(
//                 element._id,
//                 {
//                   student: student,
//                   club: element.club,
//                   designation: element.designation,
//                   session: element.session,
//                 },
//                 { new: true, upsert: true },
//               ).exec();
//             }
//           }
//         }
//         if (User == "Gensec_Scitech") {
//           for (const element of PORs) {
//             if (element.type == "Scitech-POR") {
//               await ScietechPOR.findByIdAndUpdate(
//                 element._id,
//                 {
//                   student: student,
//                   club: element.club,
//                   designation: element.designation,
//                   session: element.session,
//                 },
//                 { new: true, upsert: true },
//               ).exec();
//             }
//           }
//         }
//         if (User == "Gensec_Cult") {
//           for (const element of PORs) {
//             if (element.type == "Cult-POR") {
//               await CultPOR.findByIdAndUpdate(
//                 element._id,
//                 {
//                   student: student,
//                   club: element.club,
//                   designation: element.designation,
//                   session: element.session,
//                 },
//                 { new: true, upsert: true },
//               ).exec();
//             }
//           }
//         }
//         if (User == "Gensec_Sport") {
//           for (const element of PORs) {
//             await SportsPOR.findByIdAndUpdate(
//               element._id,
//               {
//                 student: student,
//                 club: element.club,
//                 designation: element.designation,
//                 session: element.session,
//               },
//               { new: true, upsert: true },
//             ).exec();
//           }
//         }
//         if (User == "Gensec_Acad") {
//           for (const element of PORs) {
//             if (element.type == "Acad-POR") {
//               await AcadPOR.findByIdAndUpdate(
//                 element._id,
//                 {
//                   student: student,
//                   club: element.club,
//                   designation: element.designation,
//                   session: element.session,
//                 },
//                 { new: true, upsert: true },
//               ).exec();
//             }
//           }
//         }
//         await mongoose.connection.close();
//         return res
//           .status(200)
//           .json({ success: true, message: "Data Updated Successfully" });
//       })
//       .catch((error) => {
//         console.error("MongoDB connection error:", error);
//       });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ success: false, message: "process failed" });
//   }
// });

module.exports = router;
