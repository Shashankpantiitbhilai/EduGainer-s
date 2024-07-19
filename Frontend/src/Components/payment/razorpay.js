import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendFormData } from "../../services/utils";
import { toast } from 'react-toastify';
import { sendFeeData } from "../../services/library/utils";

const Payment = ({ formData, imageBase64, userId, setLoading, amount, status }) => {

  const navigate = useNavigate();
  const baseURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_PROD
      : process.env.REACT_APP_BACKEND_DEV;

  console.log(baseURL, process.env.REACT_APP_BACKEND_DEV);
console.log(status)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  console.log(formData);
  const initializePayment = async () => {
    setLoading(true);
    console.log(formData, "jjjjj");
    const formDataWithImage = {
      ...formData ,
      image: imageBase64,
      userId: userId,
      amount: amount
    };
    // console.log(amount);
    console.log(formData);
    try {
      let result;
      if (status === "newRegistration") {
        console.log("hi",formDataWithImage)
        result = await sendFormData(formDataWithImage);
      }
      else {
        console.log("bi",formDataWithImage)
        result = await sendFeeData(formDataWithImage);
      }
      const { key, order, user } = result;
      console.log(result);
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
    
          let callbackUrl;
          if (status === "newRegistration")
            callbackUrl = `${baseURL}/payment-verification/${userId}`;
          else {
            callbackUrl = `${baseURL}/library/verify-payment/${userId}`;
          }
          console.log(baseURL, callbackUrl);
          try {
            const verificationResponse = await axios.post(callbackUrl, {
              amount,
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              signature: razorpay_signature,
              formData
            });
          
            if (verificationResponse.data.success) {
              if (status === "newRegistration") {
                // toast.success("Registration successful!");
                navigate(`/success/${userId}`);
              } else {
                // toast.success("Fee paid successfully!");
                navigate(`/`);
              }
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification failed. Please try again.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            console.error("Payment popup closed");
            toast.info("Payment cancelled.");
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment };
};

export default Payment;