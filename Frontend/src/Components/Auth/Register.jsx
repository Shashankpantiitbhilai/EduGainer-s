import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  Link,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../services/auth";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalMallIcon from "@mui/icons-material/LocalMall"; // If you need this icon
import ClassIcon from "@mui/icons-material/Class";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import StarIcon from "@mui/icons-material/Star"; // If you need this icon

// Theme colors matching login page
const colors = {
  primary: "#2E7D32",
  secondary: "#FFB100",
  background: "#f0f7ff",
  textDark: "#333333",
  textMuted: "#666666",
  link: "#1976d2",
};

function Register() {
  const { control, handleSubmit, setError, formState } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data.email, data.password);

      if (response && response.message === "User already exists") {
        setError("email", { type: "manual", message: "Email already exists" });
      } else if (response && response.message === "OTP sent successfully") {
        toast.success("OTP sent successfully, check your entered email ID");
        setTimeout(() => {
          navigate(`/otp-verify/${response.email}`);
        }, 3000);
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Grid container>
        {/* Left Section - Marketing Content */}
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
            Uttarkashi's Complete Education Hub-EduGainer's
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
                Learn from Uttarkashi's most experienced teachers who understand
                students' needs and competitive exam patterns.
              </Typography>
            </Box>
          </Box>

          {/* Fourth marketing info section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
            <OndemandVideoIcon sx={{ fontSize: 40, color: colors.secondary }} />
            <Box>
              <Typography
                variant="h6"
                sx={{ color: colors.secondary, fontWeight: 500 }}
              >
                Comprehensive Study Programs
              </Typography>
              <Typography sx={{ color: colors.textMuted }}>
                Complete preparation for Boards (6-12), JEE, NEET, UPSC, and PCS
                with regular mock tests and personalized guidance.
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
                materials, expert counseling, and dedicated academic support for
                all subjects.
              </Typography>
            </Box>
          </Box>

          {/* Unique Selling Proposition section */}
        </Grid>

        {/* Right Section - Registration Form */}
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
                  Create Account
                </Typography>
                <Typography variant="body1" color={colors.textMuted}>
                  Start your educational journey with us
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
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
                      fullWidth
                      margin="normal"
                      label="Email Address"
                      autoComplete="email"
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
                      fullWidth
                      margin="normal"
                      label="Password"
                      type={showPassword ? "text" : "password"}
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />

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
                  Send OTP
                </Button>

                <Typography
                  variant="body2"
                  align="center"
                  color={colors.textMuted}
                  sx={{ mt: 3 }}
                >
                  Already have an account?{" "}
                  <Link href="/login" sx={{ color: colors.link }}>
                    Sign in
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

export default Register;
