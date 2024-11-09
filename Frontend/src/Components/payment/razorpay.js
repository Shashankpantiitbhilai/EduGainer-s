import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { sendFormData } from "../../services/utils";
import { toast } from 'react-toastify';
import { sendFeeData } from "../../services/library/utils";
import { createOrder } from "../../services/Class/utils";

const Payment = ({ formData, imageBase64, userId, setLoading, amount, status }) => {
  const navigate = useNavigate();
  const baseURL = process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_PROD
    : process.env.REACT_APP_BACKEND_DEV;

  // Initialize page lock immediately on component mount
  useEffect(() => {
    let warningCount = 0;
    let isPaymentInProgress = false;

    // Warning message function with counter
    const showWarning = (e) => {
      if (!isPaymentInProgress) return; // Only show warning if payment is in progress

      warningCount++;
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome

      let message = '';
      if (warningCount === 1) {
        message = '⚠️ Warning: Payment is in progress. Please do not refresh or leave the page.';
      } else if (warningCount === 2) {
        message = '⚠️ FINAL WARNING: Refreshing or leaving may result in payment failure!';
      } else {
        message = '⛔ CRITICAL: DO NOT LEAVE! Payment is being processed. You may lose your money if you exit now.';
      }

      return message;
    };

    // Keyboard shortcut prevention
    const preventKeyboardShortcuts = (e) => {
      if (!isPaymentInProgress) return;

      // Prevent various refresh/navigation shortcuts
      const blockedKeys = ['r', 'w', 'F5', 'F11', 'Escape'];
      if (
        (e.ctrlKey && blockedKeys.includes(e.key)) ||
        (e.altKey && e.key === 'Tab') ||
        blockedKeys.includes(e.key)
      ) {
        e.preventDefault();
        toast.error("⚠️ Page navigation is locked during payment", { toastId: 'navigation-locked' });
      }
    };

    // Mouse back button prevention
    const preventMouseBack = (e) => {
      if (!isPaymentInProgress) return;
      window.history.pushState(null, null, window.location.href);
    };

    // Create and show overlay
    const showPaymentOverlay = () => {
      const overlay = document.createElement('div');
      overlay.id = 'payment-lock-overlay';
      overlay.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          font-family: Arial, sans-serif;
        ">
          <div style="
            width: 60px;
            height: 60px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          "></div>
          <div style="
            color: #ffffff;
            font-size: 24px;
            text-align: center;
            max-width: 80%;
            line-height: 1.5;
          ">
            <p style="margin: 10px 0;">💳 Payment in Progress</p>
            <p style="font-size: 18px; color: #ff9800;">DO NOT refresh or close this window</p>
            <div style="
              background: rgba(255, 152, 0, 0.1);
              border: 1px solid #ff9800;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
              font-size: 16px;
            ">
              <p style="margin: 0;">⚠️ Leaving this page may result in:</p>
              <ul style="text-align: left; margin: 10px 0;">
                <li>Payment failure</li>
                <li>Double charging</li>
                <li>Transaction errors</li>
              </ul>
            </div>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(overlay);
    };

    // Lock page function
    const lockPage = () => {
      isPaymentInProgress = true;
      showPaymentOverlay();
      window.history.pushState(null, null, window.location.href);
      document.addEventListener('keydown', preventKeyboardShortcuts);
      window.addEventListener('beforeunload', showWarning);
      window.addEventListener('popstate', preventMouseBack);
    };

    // Unlock page function
    const unlockPage = () => {
      isPaymentInProgress = false;
      const overlay = document.getElementById('payment-lock-overlay');
      if (overlay) overlay.remove();
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      window.removeEventListener('beforeunload', showWarning);
      window.removeEventListener('popstate', preventMouseBack);
    };

    // Make functions available globally for the razorpay handlers
    window.lockPaymentPage = lockPage;
    window.unlockPaymentPage = unlockPage;

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
      unlockPage();
      delete window.lockPaymentPage;
      delete window.unlockPaymentPage;
    };
  }, []);

  const initializePayment = async () => {
    setLoading(true);
    window.lockPaymentPage(); // Lock the page before starting payment

    const formDataWithImage = {
      ...formData,
      amount,
      image: imageBase64
    };

    try {
      let result;
      if (status === "newRegistration") {
        result = await sendFormData(amount);
      } else if (status === "newClassRegistration") {
        result = await createOrder(amount);
      } else {
        result = await sendFeeData(amount, status);
      }
      const { key, order } = result;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "EduGainer's Classes & Library",
        description: "Registration Fee",
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
          let callbackUrl;

          if (status === "newRegistration") {
            callbackUrl = `${baseURL}/payment-verification/${userId}`;
          } else if (status === "newClassRegistration") {
            callbackUrl = `${baseURL}/classes/payment-verification/${userId}`;
          } else {
            callbackUrl = `${baseURL}/library/verify-payment/${userId}`;
          }

          try {
            let verificationResponse;
            if (status === "newRegistration" || status === "newClassRegistration") {
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

            if (verificationResponse.data.success) {
              if (status === "newRegistration") {
                toast.success("Registration successful! Please contact the office to get your seat and shift.");
                window.unlockPaymentPage();
                navigate(`/success/${userId}`);
              } else if (status === "newClassRegistration") {
                toast.success("Class registration successful! Please check your email for further instructions.");
                window.unlockPaymentPage();
                navigate(`/class-success/${userId}`);
              } else if (status === "Reregistration") {
                toast.success("Re-registration successful! Please contact the office to get your shift and seat.");
                window.unlockPaymentPage();
                setTimeout(() => navigate('/'), 3000);
              } else {
                toast.success("Fee paid successfully!");
                window.unlockPaymentPage();
                navigate(`/`);
              }
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification failed. Please try again.");
            window.unlockPaymentPage();
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            window.unlockPaymentPage();
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
      window.unlockPaymentPage();
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment };
};

export default Payment;