import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Grid,
  useTheme,
  Link,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { AdminContext } from "../../App";
import { loginUser } from "../../services/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ClassIcon from "@mui/icons-material/Class";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";

import {
  LocalMall as LocalMallIcon,
  Star as StarIcon,
} from "@mui/icons-material";
// Theme colors
const colors = {
  primary: "#2E7D32",
  secondary: "#FFB100",
  background: "#f0f7ff",
  textDark: "#333333",
  textMuted: "#666666",
  link: "#1976d2",
};

export default function Login() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showPassword, setShowPassword] = useState(false);
  const { setIsUserLoggedIn } = useContext(AdminContext);
  const navigate = useNavigate();
 
  const form = useForm();
  const { register, handleSubmit, formState, setError, clearErrors } = form;
  const { errors } = formState;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get("auth_success");
    const userInfo = urlParams.get("user_info");

    if (authSuccess === "true" && userInfo) {
      try {
        const user = JSON.parse(decodeURIComponent(userInfo));
        setIsUserLoggedIn(user);

        if (user.status === "blocked") {
          toast.error("You have been blocked by the administrator.", {
            autoClose: 3000,
          });
          return;
        }

        if (user.role === "admin" || user.role==="superadmin") {
          navigate("/admin_home");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
        setError("Error processing user information");
      }
    } else if (authSuccess === "false") {
      setError("Authentication failed");
    }
  }, [navigate, setIsUserLoggedIn, setError]);
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
        if (response.user.status === "blocked") {
          toast.error("You have been blocked by the administrator.", {
            autoClose: 3000,
          });
          return;
        }
        setIsUserLoggedIn(response.user);
        toast.success("Login successful", { autoClose: 2000 });
      
        if (response.user.role === "admin" ||response.user.role === "superAdmin" ) navigate("/admin_home");
        else navigate("/");
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Grid container>
        {/* Left Section */}
        {!isMobile && (
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              bgcolor: colors.background,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 6,
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: colors.primary, fontWeight: 500, mb: 2 }}
            >
              Uttarkashi's Complete Education Hub - EduGainer's
            </Typography>

            {/* First marketing info section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <LibraryBooksIcon sx={{ fontSize: 40, color: colors.primary }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.primary, fontWeight: 500 }}
                >
                  Best Library in Uttarkashi
                </Typography>
                <Typography sx={{ color: colors.textMuted }}>
                  Access our extensive collection of books, study materials, and
                  resources for Board classes 6-12, JEE, NEET, UPSC, and PCS
                  preparation.
                </Typography>
              </Box>
            </Box>

            {/* Second marketing info section - Stationery */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <LocalMallIcon sx={{ fontSize: 40, color: colors.secondary }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.secondary, fontWeight: 500 }}
                >
                  MeriStationary - Your Complete Stationery Store
                </Typography>
                <Typography sx={{ color: colors.textMuted }}>
                  Uttarkashi's largest collection of quality stationery, books,
                  art supplies, and educational materials at the best prices.
                  One-stop shop for all your academic needs.
                </Typography>
              </Box>
            </Box>

            {/* Third marketing info section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <ClassIcon sx={{ fontSize: 40, color: colors.primary }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.primary, fontWeight: 500 }}
                >
                  Expert Faculty
                </Typography>
                <Typography sx={{ color: colors.textMuted }}>
                  Learn from Uttarkashi's most experienced teachers who
                  understand students' needs and competitive exam patterns.
                </Typography>
              </Box>
            </Box>

            {/* Fourth marketing info section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <OndemandVideoIcon
                sx={{ fontSize: 40, color: colors.secondary }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.secondary, fontWeight: 500 }}
                >
                  Comprehensive Study Programs
                </Typography>
                <Typography sx={{ color: colors.textMuted }}>
                  Complete preparation for Boards (6-12), JEE, NEET, UPSC, and
                  PCS with regular mock tests and personalized guidance.
                </Typography>
              </Box>
            </Box>

            {/* Fifth marketing info section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StarIcon sx={{ fontSize: 40, color: colors.primary }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: colors.primary, fontWeight: 500 }}
                >
                  Premium Services & Support
                </Typography>
                <Typography sx={{ color: colors.textMuted }}>
                  Everything under one roof - MeriStationary store, study
                  materials, expert counseling, and dedicated academic support
                  for all subjects.
                </Typography>
              </Box>
            </Box>

            {/* Unique Selling Proposition section */}
          </Grid>
        )}

        {/* Right Section */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Container maxWidth="sm">
            <ToastContainer />
            <Box sx={{ width: "100%", maxWidth: 450 }}>
              <Box sx={{ mb: 5, textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color={colors.textMuted}>
                  Please sign in to your account
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: colors.textMuted }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: colors.textMuted }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    my: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: colors.textMuted,
                          "&.Mui-checked": { color: colors.primary },
                        }}
                      />
                    }
                    label="Remember me"
                  />
                  <Link href="/forgot-password" sx={{ color: colors.link }}>
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    bgcolor: colors.primary,
                    py: 1.5,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: colors.primary,
                      filter: "brightness(110%)",
                    },
                  }}
                >
                  Sign In
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderColor: colors.textMuted,
                    color: colors.textMuted,
                    background: "orange",
                  }}
                >
                  Sign in with Google
                </Button>

                <Typography
                  variant="body2"
                  align="center"
                  color={colors.textMuted}
                  sx={{ mt: 3 }}
                >
                  Don’t have an account?{" "}
                  <Link href="/register" sx={{ color: colors.link }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}
