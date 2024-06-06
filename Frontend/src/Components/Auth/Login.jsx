import React, { useState, useContext } from "react";
import { AdminContext } from "../../App";
import { Button, TextField, Container, Typography, Grid } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { loginUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useMediaQuery, useTheme } from "@mui/material";

function Login() {
  const form = useForm();
  const { register, handleSubmit, control, formState, setError, clearErrors } =
    form;
  const { errors } = formState;
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is small (sm and below)

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      console.log(response);
      if (response && response.user.role === "user") {
        setIsUserLoggedIn(response.user);
        navigate("/");
      } else if (response && response.user.role === "admin") {
        setIsUserLoggedIn(response.user);
        navigate("/admin_home");
      } else {
        setError("login", { type: "manual", message: "Invalid credentials" });
        // Clear the error after a short delay
        setTimeout(() => {
          clearErrors("login"); // Assuming clearErrors is defined in useForm
        }, 3000); // Adjust the delay as needed
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: isSmallScreen ? "80%" : "30%" }}
        noValidate
      >
        <Typography variant="h4" align="center" mt={3} mb={3}>
          Sign In
        </Typography>

        <TextField
          fullWidth
          id="email"
          label="Email address"
          variant="outlined"
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />

        <TextField
          fullWidth
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            maxLength: {
              value: 16,
              message: "Password must not exceed 16 characters",
            },
          })}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>

        <Typography align="center">
          <a href="/forgot-password">Forgot Password</a>
        </Typography>

        <Button
          href="http://localhost:8000/auth/google"
          variant="contained"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
        >
          Sign in with Google <GoogleIcon />
        </Button>

        <Typography align="center">
          Don't have an Account? <a href="/register">Register</a>
        </Typography>
      </form>
      <DevTool control={control} />
    </Container>
  );
}

export default Login;
