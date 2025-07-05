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
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  styled,
  alpha,
  keyframes,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AutoStories as AutoStoriesIcon,
  Star as StarIcon,
  Class as ClassIcon,
  OndemandVideo as OndemandVideoIcon,
  LibraryBooks as LibraryBooksIcon,
  LocalMall as LocalMallIcon,
} from "@mui/icons-material";
import { motion } from 'framer-motion';
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from "../../services/auth";
import { designTokens, glassMorphism } from '../../theme/enterpriseTheme';

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

const float = keyframes`
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-10px);
  }
`;

// Enterprise styled components
const RegisterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
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
    background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const MarketingPanel = styled(Grid)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
}));

const RegisterCard = styled(Paper)(({ theme }) => ({
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

const EnterpriseButton = styled(Button)(({ theme }) => ({
  borderRadius: designTokens.borderRadius.lg,
  textTransform: 'none',
  fontWeight: designTokens.typography.fontWeight.bold,
  fontSize: designTokens.typography.fontSize.base,
  padding: theme.spacing(1.5, 3),
  position: 'relative',
  overflow: 'hidden',
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.main})`,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
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

const FeatureItem = styled(Box)(({ theme, delay = 0 }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: designTokens.borderRadius.lg,
  background: alpha(theme.palette.background.paper, 0.3),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  ...glassMorphism(0.02),
  animation: `${fadeInUp} 0.6s ease-out ${delay}s backwards`,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
    background: alpha(theme.palette.background.paper, 0.5),
  },
}));

const AnimatedIcon = styled(Box)(({ theme, color }) => ({
  fontSize: 40,
  color: color || theme.palette.primary.main,
  animation: `${float} 3s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 48,
}));
function Register() {
  const { control, handleSubmit, setError, formState } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      icon: LibraryBooksIcon,
      title: "Best Library in Uttarkashi",
      description: "Access our extensive collection of books, study materials, and resources for Board classes 6-12, JEE, NEET, UPSC, and PCS preparation.",
      color: theme.palette.primary.main,
      delay: 0.1,
    },
    {
      icon: LocalMallIcon,
      title: "MeriStationary - Complete Stationery Store",
      description: "Uttarkashi's largest collection of quality stationery, books, art supplies, and educational materials at the best prices.",
      color: theme.palette.secondary.main,
      delay: 0.2,
    },
    {
      icon: ClassIcon,
      title: "Expert Faculty",
      description: "Learn from Uttarkashi's most experienced teachers who understand students' needs and competitive exam patterns.",
      color: theme.palette.primary.main,
      delay: 0.3,
    },
    {
      icon: OndemandVideoIcon,
      title: "Comprehensive Study Programs",
      description: "Complete preparation for Boards (6-12), JEE, NEET, UPSC, and PCS with regular mock tests and personalized guidance.",
      color: theme.palette.secondary.main,
      delay: 0.4,
    },
    {
      icon: StarIcon,
      title: "Premium Services & Support",
      description: "Everything under one roof - MeriStationary store, study materials, expert counseling, and dedicated academic support.",
      color: theme.palette.primary.main,
      delay: 0.5,
    },
  ];

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
    <RegisterContainer>
      <Grid container sx={{ height: '100%' }}>
        {/* Left Section - Marketing Content */}
        {!isMobile && (
          <MarketingPanel item xs={12} md={6}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Fade in timeout={800}>
                <Typography
                  variant="h3"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: designTokens.typography.fontWeight.bold,
                    marginBottom: theme.spacing(4),
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  Uttarkashi's Complete Education Hub - EduGainer's
                </Typography>
              </Fade>

              {features.map((feature, index) => (
                <FeatureItem key={index} delay={feature.delay}>
                  <AnimatedIcon color={feature.color}>
                    <feature.icon sx={{ fontSize: 40 }} />
                  </AnimatedIcon>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: feature.color,
                        fontWeight: designTokens.typography.fontWeight.bold,
                        marginBottom: theme.spacing(0.5),
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </FeatureItem>
              ))}
            </Box>
          </MarketingPanel>
        )}

        {/* Right Section - Registration Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(4),
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Container maxWidth="sm">
            <ToastContainer 
              theme={theme.palette.mode}
              toastStyle={{
                borderRadius: designTokens.borderRadius.lg,
                ...glassMorphism(0.1),
              }}
            />
            <RegisterCard elevation={0}>
              <Fade in timeout={1000}>
                <Box>
                  <Box sx={{ marginBottom: theme.spacing(5), textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: theme.spacing(2) }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: designTokens.borderRadius.xl,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.palette.primary.contrastText,
                          animation: `${float} 3s ease-in-out infinite`,
                          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 32 }} />
                      </Box>
                    </Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        marginBottom: theme.spacing(2),
                        fontWeight: designTokens.typography.fontWeight.bold,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Create Account
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: designTokens.typography.fontWeight.medium,
                      }}
                    >
                      Start your educational journey with us
                    </Typography>
                  </Box>

                  <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ position: 'relative', zIndex: 1 }}
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
                        <StyledTextField
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
                                <EmailIcon sx={{ color: theme.palette.text.secondary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ marginBottom: theme.spacing(2) }}
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
                        <StyledTextField
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
                                <LockIcon sx={{ color: theme.palette.text.secondary }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{
                                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                    },
                                  }}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ marginBottom: theme.spacing(3) }}
                        />
                      )}
                    />

                    <EnterpriseButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(2) }}
                    >
                      Send OTP
                    </EnterpriseButton>

                    <Typography
                      variant="body2"
                      align="center"
                      sx={{
                        marginTop: theme.spacing(3),
                        color: theme.palette.text.secondary,
                      }}
                    >
                      Already have an account?{' '}
                      <Link 
                        href="/login" 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontWeight: designTokens.typography.fontWeight.bold,
                          textDecoration: 'none',
                          transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                          '&:hover': {
                            textDecoration: 'underline',
                            color: theme.palette.primary.dark,
                          },
                        }}
                      >
                        Sign in
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </RegisterCard>
          </Container>
        </Grid>
      </Grid>
    </RegisterContainer>
  );
}

export default Register;
