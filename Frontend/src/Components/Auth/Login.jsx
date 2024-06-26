import React, { useContext } from "react";
import { AdminContext } from "../../App";
import { Button, TextField, Container, Box, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { loginUser } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
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
  "&:before": {
    content: '""',
    flex: 1,
    borderBottom: "1px solid #ccc",
  },
  "&:after": {
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
  const { register, control, handleSubmit, formState, setError, clearErrors } =
    form;
  const { errors } = formState;
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();

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
          clearErrors("login");
        }, 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <LoginContainer>
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
          Submit
        </Button>

        <Divider>
          <Typography variant="body1">OR</Typography>
        </Divider>

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          startIcon={<GoogleIcon />}
          href="https://edu-gainer-s-frontend-alpha.vercel.app/auth/google"
          sx={{ mt: 2 }}
        >
          Sign in with Google
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </LoginForm>
      <DevTool control={control} />
    </LoginContainer>
  );
}

export default Login;
