const express = require("express");
const { LibStudent, User } = require("../models/student");
const { uploadToCloudinary } = require("../cloudinary");
const { createOrder, verifyPaymentSignature } = require("./payment");
const { getModelForMonth } = require('../models/student'); // Assume the function is defined in utils/modelUtils.js
const getCurrentMonthBookingModel = () => {
  const now = new Date();
  return getModelForMonth(now.getMonth() + 1);
};

const router = express.Router();
const path = require('path');
const PDFDocument = require('pdfkit');
const axios = require("axios");
const fs = require('fs');
const { sendEmailWithAttachment } = require("../emailSender")
const { Message } = require("../models/chat")


// Route to post a new message
router.post('/messages', async (req, res) => {
  const { sender, receiver, message } = req.body;
  console.log(req.body);
  const newMessage = await Message.create({ sender, receiver, message });
  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUserData = req.body;
    let imageUrl;
   
    if (updatedUserData.image) {
      const results = await uploadToCloudinary(updatedUserData.image, "Library_Students");
      imageUrl = results.url;
      delete updatedUserData.image; // Remove the image from the updatedUserData object
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updatedUserData, ...(imageUrl && { photoUpload: imageUrl }) }, // Add the imageUrl if it exists
      { new: true, runValidators: true }
    );
    console.log(updatedUser)
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




 

router.post("/Lib-new-reg", async (req, res) => {
  const { amount } = req.body;
  try{
 const order= await createOrder(amount)
    // console.log(user);

    res.status(200).json({
      success: true,
      order,
      
      key: process.env.KEY_ID_RZRPAY
    });
  } catch (error) {
    console.error("Error creating user or processing payment:", error);
    res.status(500).json({ error: "A server error occurred with this request" });
  }
});


// Function for registration without payment

 


router.get("/Lib_student/:user_id", async (req, res) => {
  const { user_id } = req.params;


  try {
    const user = await LibStudent.findOne({ userId: user_id });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
   
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "A server error occurred with this request" });
  }
});




router.post('/payment-verification/:user_id', async (req, res) => {
  const { order_id, payment_id, signature, formData } = req.body;

  const {
    name, email, shift, address, amount, consent,
    gender, dob, fatherName, motherName, aadhaar, contact1, contact2, examPreparation, image
  } = formData;
  const { user_id } = req.params;
  const currentMonth = new Date().getMonth() + 1;

  const Booking = getModelForMonth(currentMonth);

  try {
    // Generate Razorpay order first
    const order = await createOrder(amount);

    // Verify the payment signature
    const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);
   
    const currentDate = new Date().toISOString().split('T')[0];

    if (isSignatureValid) {
      try {
        // Create new LibStudent document
        const newStudent = new LibStudent({
          userId: user_id,
          lastfeedate: currentDate,
          name,
          email,
          shift,
          address,
          amount,
          consent,
          gender,
          dob,
          fatherName,
          motherName,
          aadhaar,
          Mode: "Online",
          contact1,
          contact2,
          examPreparation,
          Payment_detail: {
            razorpay_order_id: order_id,
            razorpay_payment_id: payment_id
          },
          image: {} // Will be updated after image upload
        });

        // Upload image if it exists
        if (image) {
          const results = await uploadToCloudinary(image, "Library_Students");
          // Update the student record with image data
          newStudent.image.publicId = results.publicId;
          newStudent.image.url = results.url;
        }

        // Save the student document
        await newStudent.save();

        // Now that the student is saved, we can access the generated reg number
        const reg = newStudent.reg;

        // Create or update the Booking record with the same reg number
        const bookingData = {
          userId: newStudent._id, // Reference to the LibStudent document
          reg: reg, // Use the same reg number
          name,
          shift,
          date: currentDate,
          regFee: amount,
          // Add other relevant fields from the formData or LibStudent model as needed
        };

        const booking = await Booking.findOneAndUpdate(
          { reg: reg },
          bookingData,
          { new: true, upsert: true }
        );

     

        res.status(200).json({
          success: true,
          message: 'Payment verified, student and booking records created successfully',
          studentReg: reg
        });
      } catch (error) {
        console.error("Error creating student and booking records:", error);
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
    } else {
      // Signature does not match, payment is not verified
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error("Error in payment verification process:", error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


router.get('/Lib_student/sendIdCard/:id', async (req, res) => {
  try {
    const { id } = req.params;
   
    // Fetch the student data from MongoDB
    const student = await LibStudent.findOne({ userId: id }).exec();
    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Ensure the 'idcard' directory exists
    const pdfDir = path.join(__dirname, '..', 'idcard');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }

    // Create a new PDF document with ID card dimensions
    const doc = new PDFDocument({ size: [300, 200], margins: { top: 10, bottom: 10, left: 10, right: 10 } }); // Adjusted size and added margins
    const pdfPath = path.join(pdfDir, `Id${id}.pdf`);
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#008000'); // Green background

    doc.fillColor('#FFFF00') // Yellow text
      .fontSize(16)
      .font('Helvetica-Bold')
      .text("EduGainer's Library", { align: 'center', width: doc.page.width, lineGap: 2 });

    // Add horizontal line below the heading
    doc.strokeColor('#FFFF00') // Yellow line
      .lineWidth(2)
      .moveTo(20, 30)
      .lineTo(doc.page.width - 20, 30)
      .stroke();

    const imageUrl = student.image.url;
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const imageWidth = 80;
    const imageHeight = 80;
    const imageX = doc.page.width - imageWidth - 20;
    const imageY = 40; // Adjusted position

    // Add a rounded rectangle border for the image
    doc.strokeColor('#FFFFFF') // Yellow border
      .lineWidth(2)
      .roundedRect(imageX - 5, imageY - 5, imageWidth + 10, imageHeight + 10, 5)
      .stroke();

    doc.image(imageBuffer, { fit: [imageWidth, imageHeight], x: imageX, y: imageY });

    const formX = 20;
    const formY = 40;
    const lineSpacing = 16;
    doc.fillColor('#FFFF00') // Yellow text
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(`Name: ${student.name}`, formX, formY);
    doc.font('Helvetica') // Switch to regular font for other fields
      .text(`Shift: ${student.shift}`, formX, formY + lineSpacing)
      // .text(`Amount: ${student.amount}`, formX, formY + 2 * lineSpacing)
      .text(`Email: ${student.email}`, formX, formY + 2 * lineSpacing)
      .text(`Mobile: ${student.mobile}`, formX, formY + 3 * lineSpacing)
      .text(`Address: ${student.address}`, formX, formY + 4 * lineSpacing);

    doc.end();


    writeStream.on('finish', async () => {
      const email = student.email;
      const subject = 'Your EduGainer Library ID Card';
      const text = 'Thank you for registering! Here is your ID card.';
      const attachments = [
        {
          filename: 'IDCard.pdf',
          path: pdfPath
        }
      ];

      try {
        await sendEmailWithAttachment(email, subject, text, attachments);
        emailSent = true;
        
        res.send('Email sent successfully');
      } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email');
      }

      //   // Delete the generated PDF file if the email was sent successfully
      //   if (emailSent) {
      //     fs.unlink(pdfPath, (err) => {
      //       if (err) {
      //         console.error('Failed to delete PDF file:', err);
      //       } else {
      //         console.log('PDF file deleted successfully');
      //       }
      //     });
      //   }
      // });
    })




    writeStream.on('error', (error) => {
      console.error('Error writing PDF file:', error);
      res.status(500).send('Failed to generate PDF');
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});



module.exports = router;
