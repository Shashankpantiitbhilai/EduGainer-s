import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = ({ formData, imageBase64, userId, setLoading }) => {
  const navigate = useNavigate();
  const baseURL =
    process.env.NODE_ENV === "production"
      ? process.env.BACKEND_PROD
      : process.env.BACKEND_DEV;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayment = async () => {
    setLoading(true);
    const formDataWithImage = {
      ...formData,
      image: imageBase64,
      userId: userId,
    };

    try {
      const result = await sendFormData(formDataWithImage);
      const { key, order, user } = result;
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Library Management",
        description: "Library Registration Fee",
        image: "https://example.com/logo.png",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#3399cc",
        },
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          const callbackUrl = `${baseURL}/payment-verification/${user.userId}`;

          try {
            const verificationResponse = await axios.post(callbackUrl, {
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              signature: razorpay_signature,
            });
            const id = user.userId;
            if (verificationResponse.data.success) {
              navigate(`/success/${id}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            console.error("Payment popup closed");
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment };
};

export default Payment;
