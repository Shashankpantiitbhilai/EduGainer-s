import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendFormData } from "../../services/utils";
import { toast } from 'react-toastify';
import { sendFeeData } from "../../services/library/utils";

const Payment = ({ formData, imageBase64, userId, setLoading, amount, status }) => {
  console.log(status,"kkkkkk",formData)
  const navigate = useNavigate();
  const baseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_PROD
    : process.env.REACT_APP_BACKEND_DEV;

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
      amount,
      image: imageBase64
    };

    try {
      let result;
      if (status === "newRegistration") {
        result = await sendFormData(amount);
      } else {
        result = await sendFeeData(amount, status);
      }
      const { key, order } = result;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "EduGainer's Library",
        description: "Library Registration Fee",
        image: "https://res.cloudinary.com/dlxbl2ero/image/upload/v1721800478/Library_Resources/sjnicynl3rfkomnfc884.jpg",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact1,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#3399cc",
        },
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          let callbackUrl = status === "newRegistration"
            ? `${baseURL}/payment-verification/${userId}`
            : `${baseURL}/library/verify-payment/${userId}`;
console.log(callbackUrl,"kkkkk",status)
          try {
            let verificationResponse;
            if (status === "newRegistration") {
              verificationResponse = await axios.post(callbackUrl, {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                signature: razorpay_signature,
                formData: formDataWithImage
              });
            } else {
              verificationResponse = await axios.post(callbackUrl, {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                signature: razorpay_signature,
                formData: formDataWithImage,
                status
              });
            }
        console.log(verificationResponse.data)
            if (verificationResponse.data.success) {
              if (status === "newRegistration") {
                
                toast.success("Registration successful! Please contact the office to get your seat and shift."); navigate(`/success/${userId}`);
              } else if (status === "Reregistration") {
                toast.success("Re-registration successful! Please contact the office to get your shift and seat.");
                setTimeout(()=>navigate('/'),3000)
              } else {
                toast.success("Fee paid successfully!");
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