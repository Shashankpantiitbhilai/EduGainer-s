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
import { sendFormData } from "../../services/utils.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../App.js";

function NewReg() {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const id = IsUserLoggedIn._id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://edu-gainer-s-backend.vercel.app"
      : "http://localhost:8000";
  const navigate = useNavigate();

  const selectedShift = watch("shift");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Update the amount based on the selected shift
    const shiftAmounts = {
      "6.30 AM to 2 PM": 5,
      "2 PM to 9.30 PM": 5,
      "6.30 PM to 11 PM": 3,
      "9.30 PM to 6.30 AM": 5,
      "2 PM to 11 PM": 7,
      "6.30 AM to 6.30 PM": 8,
      "24*7": 1,
    };

    setValue("amount", shiftAmounts[selectedShift] || "");
  }, [selectedShift, setValue]);

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

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 9 }}
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
          id="shift"
          label="Shift Chosen"
          {...register("shift", { required: "Shift selection is required" })}
          error={!!errors.shift}
          helperText={errors.shift?.message}
        >
          <MenuItem value="">Select Shift</MenuItem>
          <MenuItem value="6.30 AM to 2 PM">6.30 AM to 2 PM</MenuItem>
          <MenuItem value="2 PM to 9.30 PM">2 PM to 9.30 PM</MenuItem>
          <MenuItem value="6.30 PM to 11 PM">6.30 PM to 11 PM</MenuItem>
          <MenuItem value="9.30 PM to 6.30 AM">9.30 PM to 6.30 AM</MenuItem>
          <MenuItem value="2 PM to 11 PM">2 PM to 11 PM</MenuItem>
          <MenuItem value="6.30 AM to 6.30 PM">6.30 AM to 6.30 PM</MenuItem>
          <MenuItem value="24*7">24*7</MenuItem>
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
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="gender"
          label="Gender"
          {...register("gender", { required: "Gender is required" })}
          error={!!errors.gender}
          helperText={errors.gender?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="dob"
          label="Date of Birth"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          {...register("dob", { required: "Date of Birth is required" })}
          error={!!errors.dob}
          helperText={errors.dob?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="fatherName"
          label="Father's Name"
          {...register("fatherName", { required: "Father's Name is required" })}
          error={!!errors.fatherName}
          helperText={errors.fatherName?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="motherName"
          label="Mother's Name"
          {...register("motherName", { required: "Mother's Name is required" })}
          error={!!errors.motherName}
          helperText={errors.motherName?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="contact1"
          label="Primary Contact Number"
          {...register("contact1", {
            required: "Primary contact number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Please enter a valid 10-digit contact number",
            },
          })}
          error={!!errors.contact1}
          helperText={errors.contact1?.message}
        />

        <TextField
          margin="normal"
          fullWidth
          id="contact2"
          label="Secondary Contact Number"
          {...register("contact2", {
            pattern: {
              value: /^\d{10}$/,
              message: "Please enter a valid 10-digit contact number",
            },
          })}
          error={!!errors.contact2}
          helperText={errors.contact2?.message}
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
          id="address"
          label="Address"
          {...register("address", { required: "Address is required" })}
          error={!!errors.address}
          helperText={errors.address?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="aadhaar"
          label="Aadhaar or Any ID No"
          {...register("aadhaar", { required: "Aadhaar or ID No is required" })}
          error={!!errors.aadhaar}
          helperText={errors.aadhaar?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="examPreparation"
          label="Preparing for Exam"
          {...register("examPreparation", {
            required: "This field is required",
          })}
          error={!!errors.examPreparation}
          helperText={errors.examPreparation?.message}
        />

        <TextField
          margin="normal"
          fullWidth
          type="file"
          id="image"
          inputProps={{ accept: "image/*" }}
          onChange={handleImage}
        />

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default NewReg;
