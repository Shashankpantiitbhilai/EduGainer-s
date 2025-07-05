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
  Paper,
  Fade,
  Zoom,
  styled,
  alpha,
  keyframes,s
} from "@mui/material";
import {colors} from "../../theme/enterpriseTheme";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  AutoStories as AutoStoriesIcon,
} from "@mui/icons-material";
import { motion } from 'framer-motion';
import { useForm } from "react-hook-form";
import { AdminContext } from "../../App";
import { loginUser } from "../../services/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { designTokens, glassMorphism, hoverScale } from '../../theme/enterpriseTheme';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ClassIcon from '@mui/icons-material/Class';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import StarIcon from '@mui/icons-material/Star';

// Enhanced animations for smooth UI
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

// Enterprise styled components
const LoginContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const LoginCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: designTokens.borderRadius.xxl,
  background: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  ...glassMorphism(0.05),
  boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
    animation: `${shimmer} 3s infinite`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: alpha(theme.palette.background.default, 0.5),
    border: `2px solid transparent`,
    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.default, 0.7),
      border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.background.default, 0.9),
      border: `2px solid ${theme.palette.primary.main}`,
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
      transform: 'translateY(-2px)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: designTokens.typography.fontWeight.medium,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
      fontWeight: designTokens.typography.fontWeight.bold,
    },
  },
}));

const EnterpriseButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: designTokens.borderRadius.lg,
  textTransform: 'none',
  fontWeight: designTokens.typography.fontWeight.bold,
  fontSize: designTokens.typography.fontSize.base,
  padding: theme.spacing(1.5, 3),
  position: 'relative',
  overflow: 'hidden',
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  ...(variant === 'primary' && {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.primary.contrastText,
    boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
  }),
  ...(variant === 'google' && {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  }),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.2)}, transparent)`,
    transition: 'left 0.5s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

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
console.log(user.role);
        if (user.role === "admin" || user.role==="superAdmin") {
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
      console.log(response.user)
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
