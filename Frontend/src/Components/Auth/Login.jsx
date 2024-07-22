import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../App";
import { Button, TextField, Container, Box, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { loginUser } from "../../services/auth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";

const LoginContainer = styled(Container)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

const LoginForm = styled(Box)({
  width: "100%",
  maxWidth: "400px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  backgroundColor: "#fff",
  textAlign: "center",
});

const Divider = styled(Box)({
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  margin: "20px 0",
  "&:before, &:after": {
    content: '""',
    flex: 1,
    borderBottom: "1px solid #ccc",
  },
  "& p": {
    margin: "0 10px",
  },
});

function Login() {
  const form = useForm();
  const { register, handleSubmit, formState, setError, clearErrors } = form;
  const { errors } = formState;
  const { setIsUserLoggedIn, IsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get("auth_success");
    const userInfo = urlParams.get("user_info");

    if (authSuccess === "true" && userInfo) {
      try {
        const user = JSON.parse(decodeURIComponent(userInfo));
        setIsUserLoggedIn(user); // Set login state to true

        if (IsUserLoggedIn?.role === "admin") {
          navigate("/admin_home");
        } else {
          navigate("/");
        }
        // Store user info in localStorage
        // Navigate to home page
      } catch (error) {
        console.error("Error parsing user info:", error);
        setError("Error processing user information");
      }
    } else if (authSuccess === "false") {
      setError("Authentication failed");
    }
  }, [navigate, setIsUserLoggedIn]);

  const getBackendUrl = () => {
    if (process.env.NODE_ENV === "production") {
      return `${process.env.REACT_APP_BACKEND_PROD}`;
    }
    return (
      process.env.REACT_APP_BACKEND_DEV || process.env.REACT_APP_BACKEND_URL
    );
  };

  const handleGoogleSignIn = () => {
    const backendUrl = getBackendUrl();
    // console.log("Backend URL:", backendUrl);

    if (backendUrl) {
      const googleAuthUrl = `${backendUrl}/auth/google`;

      window.location.href = googleAuthUrl;
    } else {
      console.error("Backend URL is undefined");
      toast.error(
        "Unable to initiate Google Sign-In. Please check the application configuration."
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      if (response && response.user) {
        setIsUserLoggedIn(response.user);
        toast.success("Login successful", { autoClose: 2000 });

        if (response.user.role === "admin") navigate("/admin_home");
        else {
          navigate("/");
        }
      } else {
        setError("login", { type: "manual", message: "Invalid credentials" });
        toast.error("Invalid credentials", { autoClose: 2000 });
        setTimeout(() => {
          clearErrors("login");
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login", { autoClose: 2000 });
    }
  };

  return (
    <LoginContainer>
      <ToastContainer />
      <LoginForm component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
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
          fullWidth
          label="Password"
          type="password"
          margin="normal"
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
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {errors.login && (
          <Typography color="error">{errors.login.message}</Typography>
        )}

        <Link
          to="/forgot-password"
          style={{ display: "block", margin: "10px 0" }}
        >
          Forgot Password?
        </Link>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>

        <Divider>
          <Typography variant="body1">OR</Typography>
        </Divider>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          sx={{ mt: 2 }}
        >
          Sign in with Google
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?
          <Link to="/register">Register</Link>
        </Typography>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;
