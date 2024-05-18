const Razorpay = require("razorpay");
const crypto = require('crypto');

const instance = new Razorpay({
    key_id: process.env.KEY_ID_RZRPAY,
    key_secret: process.env.KEY_SECRET_RZRPAY,
});

const createOrder = async (amount) => {
    return new Promise((resolve, reject) => {
        const options = {
            amount: amount * 100, // Convert to smallest currency unit
            currency: "INR",
            receipt: Math.random().toString(36).substring(2), // Generate a random receipt ID
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.error("Error creating Razorpay order:", error);
                return reject("A server error occurred while creating payment order");
            }
            resolve(order);
        });
    });
};

const verifyPaymentSignature = (order_id, razorpay_payment_id, razorpay_signature) => {
    const key_secret = process.env.KEY_SECRET_RZRPAY;

    // Construct the expected signature
    const generated_signature = crypto.createHmac('sha256', key_secret)
        .update(order_id + "|" + razorpay_payment_id)
        .digest('hex');
console.log(generated_signature,razorpay_signature);
    // Compare the signatures
    return generated_signature === razorpay_signature;
};

module.exports = {
    createOrder,
    verifyPaymentSignature,
};
