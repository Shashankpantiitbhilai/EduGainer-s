import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  Container,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { sendFormData } from "../../services/Class/utils.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../App.js";

function ClassesRegistration() {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const id = IsUserLoggedIn._id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase64(file);
  };

  const onSubmit = async (formData) => {
    setLoading(true);

    const formDataWithImage = {
      ...formData,
      image: imageBase64,
      userId: id,
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
          const callbackUrl = `https://edu-gainer-s-backend.vercel.app/classes/payment-verification/${user.userId}`;

          try {
            const verificationResponse = await axios.post(callbackUrl, {
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              signature: razorpay_signature,
            });
            const id = user.userId;
            if (verificationResponse.data.success) {
              navigate(`/classes/success/${id}`);
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

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Typography component="h1" variant="h5" align="center">
          Registration Form
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          select
          id="Batch"
          label="Select Class"
          {...register("Batch", { required: "Class selection is required" })}
          error={!!errors.class}
          helperText={errors.class?.message}
        >
          <MenuItem value="">Select Class</MenuItem>
          <MenuItem value="Class 6">Class 6</MenuItem>
          <MenuItem value="Class 7">Class 7</MenuItem>
          <MenuItem value="Class 8">Class 8</MenuItem>
          <MenuItem value="Class 9">Class 9</MenuItem>
        </TextField>

        <TextField
          margin="normal"
          required
          fullWidth
          type="number"
          id="amount"
          label="Amount"
          {...register("amount", { required: "Amount is required" })}
          error={!!errors.amount}
          helperText={errors.amount?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="mobile"
          label="Mobile Number"
          {...register("mobile", {
            required: "Mobile number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Please enter a valid 10-digit mobile number",
            },
          })}
          error={!!errors.mobile}
          helperText={errors.mobile?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="address"
          label="Address"
          {...register("address", { required: "Address is required" })}
          error={!!errors.address}
          helperText={errors.address?.message}
        />

        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Image
          <input type="file" hidden onChange={handleImage} accept="image/*" />
        </Button>

        <Box sx={{ position: "relative", mt: 2 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ClassesRegistration;
