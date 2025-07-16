import React from "react";
import { Box, Container, Typography, Button, Grid, Stack, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  School, 
  EmojiEvents,
  ArrowForward,
  PlayArrow,
  Stars,
  Groups,
  AutoAwesome
} from "@mui/icons-material";
import { colors, designTokens } from "./constants";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

const HeroSection = () => {
  const stats = [
    { number: "5000+", label: "Happy Students", icon: <Groups />, color: colors.accent.success },
    { number: "98%", label: "Success Rate", icon: <TrendingUp />, color: colors.secondary.main },
    { number: "100+", label: "Expert Teachers", icon: <School />, color: colors.accent.info },
    { number: "25+", label: "Years Experience", icon: <EmojiEvents />, color: colors.accent.warning },
  ];

  const features = [
    "🏆 Award-winning Institute",
    "🎯 Personalized Learning",
    "💡 Modern Facilities",
    "🌟 Expert Faculty"
  ];

  return (
    <Box
      sx={{
        background: `
          linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 50%, ${colors.primary.main} 100%),
          radial-gradient(ellipse at top, ${colors.secondary.main}20 0%, transparent 50%)
        `,
        position: "relative",
        overflow: "hidden",
        py: { xs: 10, md: 15 },
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, ${colors.secondary.main}15 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${colors.accent.info}15 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${colors.secondary.main}10 0%, transparent 50%)
          `,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Stack spacing={5}>
              {/* Animated badge */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: designTokens.borderRadius.xxl,
                    px: 3,
                    py: 1.5,
                    border: `1px solid rgba(255, 255, 255, 0.2)`,
                  }}
                >
                  <AutoAwesome sx={{ color: colors.secondary.main, fontSize: "1.2rem" }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.text.inverse,
                      fontWeight: designTokens.typography.fontWeight.medium,
                    }}
                  >
                    ✨ India's Leading Educational Institute
                  </Typography>
                </Box>
              </MotionBox>

              <MotionTypography
                variant="h1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                sx={{
                  fontSize: { xs: "2.8rem", md: "4rem", lg: "4.5rem" },
                  fontWeight: designTokens.typography.fontWeight.extraBold,
                  color: colors.text.inverse,
                  lineHeight: designTokens.typography.lineHeight.tight,
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  mb: 2,
                }}
              >
                Shape Your{" "}
                <Box
                  component="span"
                  sx={{
                    background: colors.secondary.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: colors.secondary.gradient,
                      borderRadius: 2,
                      opacity: 0.6,
                    }
                  }}
                >
                  Brilliant
                </Box>{" "}
                Future Today
              </MotionTypography>

              <MotionTypography
                variant="h5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  color: colors.neutral[100],
                  fontSize: { xs: "1.2rem", md: "1.4rem" },
                  lineHeight: designTokens.typography.lineHeight.relaxed,
                  maxWidth: "85%",
                  fontWeight: designTokens.typography.fontWeight.normal,
                }}
              >
                Join thousands of successful students who transformed their dreams into reality 
                through our world-class education, cutting-edge facilities, and personalized mentorship.
              </MotionTypography>

              {/* Feature highlights */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Grid container spacing={2}>
                  {features.map((feature, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: colors.neutral[100],
                          fontSize: "0.9rem",
                          fontWeight: designTokens.typography.fontWeight.medium,
                        }}
                      >
                        <Box component="span">{feature}</Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: colors.secondary.gradient,
                      color: colors.text.primary,
                      fontWeight: designTokens.typography.fontWeight.bold,
                      px: 5,
                      py: 2,
                      borderRadius: designTokens.borderRadius.xl,
                      textTransform: "none",
                      fontSize: "1.2rem",
                      boxShadow: `0 8px 32px ${colors.secondary.main}40`,
                      border: "none",
                      "&:hover": {
                        transform: "translateY(-3px) scale(1.02)",
                        boxShadow: `0 12px 40px ${colors.secondary.main}60`,
                        background: colors.secondary.gradient,
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    Start Your Journey
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: colors.text.inverse,
                      color: colors.text.inverse,
                      fontWeight: designTokens.typography.fontWeight.semibold,
                      px: 5,
                      py: 2,
                      borderRadius: designTokens.borderRadius.xl,
                      textTransform: "none",
                      fontSize: "1.2rem",
                      borderWidth: 2,
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        borderColor: colors.secondary.main,
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                        color: colors.secondary.main,
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    Watch Demo
                  </Button>
                </Stack>
              </MotionBox>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={6}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={6} md={3} lg={6} key={index}>
                    <MotionCard
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      sx={{
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(20px)",
                        borderRadius: designTokens.borderRadius.xl,
                        border: `1px solid rgba(255, 255, 255, 0.1)`,
                        overflow: "hidden",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-8px) scale(1.02)",
                          background: "rgba(255, 255, 255, 0.12)",
                          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2)`,
                        },
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", py: 3 }}>
                        <Box
                          sx={{
                            color: stat.color,
                            mb: 2,
                            fontSize: "2.5rem",
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Typography
                          variant="h3"
                          sx={{
                            color: colors.text.inverse,
                            fontWeight: designTokens.typography.fontWeight.extraBold,
                            fontSize: { xs: "1.8rem", md: "2.2rem" },
                            mb: 1,
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.neutral[200],
                            fontSize: "1rem",
                            fontWeight: designTokens.typography.fontWeight.medium,
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced decorative elements */}
      <Box
        sx={{
          position: "absolute",
          bottom: -200,
          left: -200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.secondary.main}15 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -250,
          right: -250,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent.info}10 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      
      {/* Floating animation elements */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: colors.secondary.main,
          opacity: 0.6,
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "30%",
          left: "5%",
          width: 15,
          height: 15,
          borderRadius: "50%",
          background: colors.accent.success,
          opacity: 0.5,
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
    </Box>
  );
};
export default HeroSection;

                