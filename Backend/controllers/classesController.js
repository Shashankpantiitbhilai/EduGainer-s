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
};

module.exports = {
    verifyPayment, getUserById, createClassRegistration
}
// Other controller functions for generating and sending PDFs, handling updates, etc.
