const express = require("express");
const { Student } = require("../models/student");
const { uploadToCloudinary } = require("../cloudinary");
const { createOrder, verifyPaymentSignature } = require("./payment");

const router = express.Router();
router.post("/Lib-new-reg", async (req, res) => {
    const { name, email, image, mobile, shift, address, amount } = req.body;

    try {
        let imageData = {};
        if (image) {
            const results = await uploadToCloudinary(image, "Library_Students");
            imageData = results;
        }

        // Generate Razorpay order first
        const order = await createOrder(amount);

        // Create user with the order ID
        const user = await Student.create({
            name,
            email,
            shift,
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
});


router.post('/payment-verification/:user_id', async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const { user_id } = req.params; // Capture user ID from URL parameters

    // Verify the payment signature
    console.log(user_id);
    const isSignatureValid = verifyPaymentSignature(order_id, payment_id, signature);

    if (isSignatureValid) {
        try {
            // Update the student record with the Razorpay order ID and payment ID
            const user = await Student.findById(user_id);
            console.log(user);
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }

            // Add Razorpay order ID and payment ID to the user record
            user.Payment_detail.razorpay_order_id = order_id;
            user.Payment_detail.razorpay_payment_id = payment_id;

            // Save the updated user record
            await user.save();

            console.log(user);
            res.redirect(`/success/${user_id}`) // Log the updated user record
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } catch (error) {
            console.error("Error updating student record:", error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } else {
        // Signature does not match, payment is not verified
        res.status(400).json({ success: false, error: 'Invalid signature' });
    }
});

module.exports = router;
