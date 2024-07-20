import React from "react";
import { Button, Container, TextField, Typography, Box } from "@mui/material";
import { registerUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Register() {
  const { control, handleSubmit, setError, formState } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data.email, data.password);
   
      
      if (response && response.message === "User already exists") {
        setError("email", { type: "manual", message: "Email already exists" });
      } else if (response && response.message === "OTP sent successfully") {
        toast.success("OTP sent successfully ,check your entered email Id")
        navigate(`/otp-verify/${response.email}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      // console.error("Registration error:", error);
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
        sx={{
          width: "100%",
          mt: 1,
        }}
        noValidate
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Register
        </Typography>
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
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 16,
              message: "Password must not exceed 16 characters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />
          )}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Send OTP
        </Button>
        <Box textAlign="center">
          <Typography variant="body2">
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
