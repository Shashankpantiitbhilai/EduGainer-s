import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Grid,
  Card,
  Typography,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import { ArrowForward, CheckCircle } from "@mui/icons-material";
import { colors, designTokens, classesOffered } from "./constants";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const ClassesOfferedSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${colors.secondary.main}15 0%, transparent 50%), 
                      radial-gradient(circle at 80% 20%, ${colors.secondary.main}10 0%, transparent 50%)`,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          sx={{ textAlign: "center", mb: 8 }}
        >
          <Chip
            label="Excellence in Education"
            sx={{
              background: colors.secondary.gradient,
              color: colors.text.primary,
              fontWeight: designTokens.typography.fontWeight.semibold,
              mb: 3,
              px: 3,
              py: 1,
              fontSize: "0.9rem",
              boxShadow: colors.shadow.md,
            }}
          />
          
          <Typography
            variant="h2"
            sx={{
              color: colors.text.inverse,
              fontWeight: designTokens.typography.fontWeight.bold,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: designTokens.typography.lineHeight.tight,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Forge Your Path to{" "}
            <Box
              component="span"
              sx={{
                background: colors.secondary.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Excellence
            </Box>
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              color: colors.neutral[200],
              fontSize: "1.25rem",
              lineHeight: designTokens.typography.lineHeight.relaxed,
              maxWidth: "800px",
              margin: "0 auto",
              fontWeight: designTokens.typography.fontWeight.normal,
            }}
          >
            At EduGainer's, we don't just prepare you for exams; we sculpt
            future leaders. Dive into our meticulously crafted courses designed
            to transform your aspirations into achievements.
          </Typography>
        </MotionBox>

        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {classesOffered.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  variants={itemVariants}
                  whileHover={{ 
                    y: -12,
                    transition: { duration: 0.3 }
                  }}
                  sx={{
                    height: "100%",
                    background: colors.background.paper,
                    borderRadius: designTokens.borderRadius.xl,
                    border: `1px solid ${colors.border.light}`,
                    boxShadow: colors.shadow.lg,
                    overflow: "hidden",
                    position: "relative",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      boxShadow: colors.shadow.xl,
                      border: `1px solid ${colors.secondary.main}`,
                      transform: "translateY(-12px)",
                    },
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  }}
                >
                  {/* Top accent bar */}
                  <Box
                    sx={{
                      height: "4px",
                      background: colors.secondary.gradient,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  />

                  <Stack spacing={3} sx={{ p: 4, height: "100%" }}>
                    {/* Icon section */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${colors.primary.main}15 0%, ${colors.secondary.main}15 100%)`,
                        border: `2px solid ${colors.primary.light}`,
                        color: colors.primary.main,
                        fontSize: "2.5rem",
                        margin: "0 auto",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: -8,
                          borderRadius: "50%",
                          background: colors.primary.gradient,
                          opacity: 0.1,
                          zIndex: -1,
                        },
                      }}
                    >
                      {course.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: colors.text.primary,
                          fontWeight: designTokens.typography.fontWeight.bold,
                          fontSize: "1.2rem",
                          lineHeight: designTokens.typography.lineHeight.tight,
                          mb: 2,
                        }}
                      >
                        {course.text}
                      </Typography>

                      {/* Features list */}
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        {["Expert Faculty", "Comprehensive Material", "Mock Tests"].map((feature, idx) => (
                          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CheckCircle 
                              sx={{ 
                                color: colors.accent.success, 
                                fontSize: "1rem" 
                              }} 
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: colors.text.secondary,
                                fontSize: "0.9rem",
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* CTA Button */}
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForward />}
                      sx={{
                        borderColor: colors.primary.main,
                        color: colors.primary.main,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        borderRadius: designTokens.borderRadius.lg,
                        textTransform: "none",
                        "&:hover": {
                          background: colors.primary.gradient,
                          color: colors.text.inverse,
                          borderColor: colors.primary.main,
                          transform: "scale(1.02)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Explore Course
                    </Button>
                  </Stack>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        {/* Bottom CTA Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          sx={{
            textAlign: "center",
            mt: 10,
            p: 6,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: designTokens.borderRadius.xxl,
            border: `1px solid rgba(255, 255, 255, 0.2)`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: colors.text.inverse,
              fontWeight: designTokens.typography.fontWeight.bold,
              mb: 2,
            }}
          >
            Ready to Start Your Success Journey?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: colors.neutral[200],
              fontSize: "1.1rem",
              mb: 4,
            }}
          >
            Join thousands of successful students who have achieved their dreams with us.
          </Typography>
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
            }}
          >
            Enroll Now
          </Button>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ClassesOfferedSection;
