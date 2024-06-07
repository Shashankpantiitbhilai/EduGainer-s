import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import { forgotPassword } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data.email);
      if (response && response.Status === "Success") {
        setSuccessMessage("Check your email");
      } else {
        setError("email", {
          type: "manual",
          message: "Error: Email not found",
        });
      }
    } catch (error) {
      console.log("Error:", error);
      setError("email", {
        type: "manual",
        message: "Error: Something went wrong",
      });
    }
    setTimeout(() => {
      clearErrors("email");
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
        noValidate
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Forgot Password
        </Typography>
        {errors.email && <Alert severity="error">{errors.email.message}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <TextField
          fullWidth
          id="email"
          label="Email address"
          variant="outlined"
          margin="normal"
          placeholder="Enter email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send
        </Button>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
