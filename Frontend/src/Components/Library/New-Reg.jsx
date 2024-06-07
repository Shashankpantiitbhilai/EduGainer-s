import React, { useState, useEffect, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
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
    control,
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
            if (verificationResponse.data.success) {
              navigate(`/classes/success/${user.userId}`);
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
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
        noValidate
      >
        <Typography component="h1" variant="h5" align="center">
          Registration Form
        </Typography>

        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Name"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
            />
          )}
        />

        <Controller
          name="Batch"
          control={control}
          defaultValue=""
          rules={{ required: "Class selection is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              variant="outlined"
              margin="normal"
              fullWidth
              label="Select Class"
              error={!!errors.Batch}
              helperText={errors.Batch ? errors.Batch.message : ""}
            >
              <MenuItem value="">Select Class</MenuItem>
              <MenuItem value="Class 6">Class 6</MenuItem>
              <MenuItem value="Class 7">Class 7</MenuItem>
              <MenuItem value="Class 8">Class 8</MenuItem>
              <MenuItem value="Class 9">Class 9</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="amount"
          control={control}
          defaultValue=""
          rules={{ required: "Amount is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Amount"
              type="number"
              error={!!errors.amount}
              helperText={errors.amount ? errors.amount.message : ""}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email Address"
              type="email"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />

        <Controller
          name="mobile"
          control={control}
          defaultValue=""
          rules={{
            required: "Mobile number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Please enter a valid 10-digit mobile number",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Mobile Number"
              type="tel"
              error={!!errors.mobile}
              helperText={errors.mobile ? errors.mobile.message : ""}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          defaultValue=""
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Address"
              error={!!errors.address}
              helperText={errors.address ? errors.address.message : ""}
            />
          )}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" component="label">
            Upload Image
          </Typography>
          <input
            type="file"
            onChange={handleImage}
            accept="image/*"
            style={{ display: "block", marginTop: 8 }}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </Box>
    </Container>
  );
}

export default ClassesRegistration;
