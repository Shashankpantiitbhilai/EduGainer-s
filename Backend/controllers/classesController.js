const { Class } = require("../models/student");
const { uploadToCloudinary } = require("../cloudinary");
const { createOrder, verifyPaymentSignature } = require("../routes/payment");
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { sendEmailWithAttachment } = require("../emailSender");

const createClassRegistration = async (req, res) => {
    const { name, email, image, mobile, Batch, address, amount, userId } = req.body;
    console.log(Batch, req.body);
    try {
        let imageData = {};
        if (image) {
            const results = await uploadToCloudinary(image, "Class_Students");
            imageData = results;
        }

        // Generate Razorpay order first
        const order = await createOrder(amount);

        // Create user with the order ID
        const user = await Class.create({
            userId,
            name,
            email,
            Batch,
            mobile,
            address,
            amount,
            image: {
                publicId: imageData.publicId,
                url: imageData.url,
            },
            Payment_detail: {
                razorpay_order_id: order.id,
                razorpay_payment_id: "" // Payment ID will be updated after payment verification
            }
        });

        console.log(user);

        res.status(200).json({
            success: true,
            order,
            user,
            key: process.env.KEY_ID_RZRPAY
        });
    } catch (error) {
        console.error("Error creating user or processing payment:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
};

const getUserById = async (req, res) => {
    const { user_id } = req.params;
    console.log(user_id, req.params);

    try {
        const user = await Class.findOne({ userId: user_id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
};

const verifyPayment = async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const { user_id } = req.params;
    console.log(user_id, "paymentverify");

    const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);
    console.log(isSignatureValid, "payment verify");
    if (isSignatureValid) {
        try {
            const user = await Class.findOne({ userId: user_id });
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            user.Payment_detail.razorpay_order_id = order_id;
            user.Payment_detail.razorpay_payment_id = payment_id;

            await user.save();
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } catch (error) {
            console.error("Error updating student record:", error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } else {
        res.status(400).json({ success: false, error: 'Invalid signature' });
    }
}

const sendIdCard = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("server")
        // Fetch the student data from MongoDB
        const student = await Class.findOne({ userId: id }).exec();
        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Ensure the 'idcard' directory exists
        const pdfDir = process.env.NODE_ENV == 'development' ? path.join(__dirname, '..', 'uploads') : '/tmp/uploads';

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
            .text(`Batch: ${student.Batch}`, formX, formY + lineSpacing)
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
                console.log('Email sent successfully');
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
};


module.exports = {
    verifyPayment, getUserById, createClassRegistration, sendIdCard
}
// Other controller functions for generating and sending PDFs, handling updates, etc.
