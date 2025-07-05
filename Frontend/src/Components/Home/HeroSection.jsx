import React from "react";
import { Box, Container, Typography, Button, Grid, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  School, 
  EmojiEvents,
  ArrowForward,
  PlayArrow
} from "@mui/icons-material";
import { colors, designTokens } from "./constants";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const HeroSection = () => {
  const stats = [
    { number: "1000+", label: "Students Enrolled", icon: <School /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp /> },
    { number: "50+", label: "Awards Won", icon: <EmojiEvents /> },
  ];

  return (
    <Box
      sx={{
        background: colors.primary.gradient,
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          background: `radial-gradient(circle at center, ${colors.secondary.main}20 0%, transparent 50%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <MotionTypography
                variant="h1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: colors.text.inverse,
                  lineHeight: designTokens.typography.lineHeight.tight,
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Transform Your{" "}
                <Box
                  component="span"
                  sx={{
                    background: colors.secondary.gradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Future
                </Box>{" "}
                with Excellence
              </MotionTypography>

              <MotionTypography
                variant="h5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  color: colors.neutral[200],
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  lineHeight: designTokens.typography.lineHeight.relaxed,
                  maxWidth: "90%",
                }}
              >
                Join India's premier educational institute where dreams meet 
                reality. Experience world-class facilities, expert guidance, 
                and a proven track record of success.
              </MotionTypography>

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
                      fontWeight: designTokens.typography.fontWeight.semibold,
                      px: 4,
                      py: 1.5,
                      borderRadius: designTokens.borderRadius.lg,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      boxShadow: colors.shadow.lg,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: colors.shadow.xl,
                      },
                      transition: "all 0.3s ease",
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
                      fontWeight: designTokens.typography.fontWeight.medium,
                      px: 4,
                      py: 1.5,
                      borderRadius: designTokens.borderRadius.lg,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      borderWidth: 2,
                      "&:hover": {
                        borderColor: colors.secondary.main,
                        backgroundColor: colors.secondary.main + "10",
                        color: colors.secondary.main,
                        borderWidth: 2,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Watch Video
                  </Button>
                </Stack>
              </MotionBox>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={12} sm={4} md={12} lg={4} key={index}>
                    <MotionBox
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      sx={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        borderRadius: designTokens.borderRadius.xl,
                        p: 3,
                        textAlign: "center",
                        border: `1px solid rgba(255, 255, 255, 0.2)`,
                        "&:hover": {
                          transform: "translateY(-5px)",
                          background: "rgba(255, 255, 255, 0.15)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Box
                        sx={{
                          color: colors.secondary.main,
                          mb: 1,
                          fontSize: "2rem",
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          color: colors.text.inverse,
                          fontWeight: designTokens.typography.fontWeight.bold,
                          fontSize: "2rem",
                          mb: 0.5,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.neutral[200],
                          fontSize: "0.9rem",
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </MotionBox>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: colors.secondary.gradient,
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: -150,
          right: -150,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.secondary.main}20 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default HeroSection;
