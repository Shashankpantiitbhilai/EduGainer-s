import React from "react";
import { motion } from "framer-motion";
import {
  Container,
  Box,
  Typography,
  Grid,
  Stack,
  Card,
  Avatar,
  Divider,
} from "@mui/material";
import { 
  Psychology, 
  EmojiEvents, 
  School, 
  TrendingUp,
  School as QuoteIcon 
} from "@mui/icons-material";
import { colors, designTokens } from "./constants";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const ApproachSection = () => {
  const approaches = [
    {
      icon: <Psychology />,
      title: "Personalized Learning",
      description: "Tailored teaching methods that adapt to each student's unique learning style and pace."
    },
    {
      icon: <EmojiEvents />,
      title: "Results-Driven",
      description: "Proven track record with 95% success rate in competitive examinations."
    },
    {
      icon: <School />,
      title: "Expert Faculty",
      description: "Learn from industry experts with years of teaching and professional experience."
    },
    {
      icon: <TrendingUp />,
      title: "Continuous Growth",
      description: "Regular assessments and feedback to ensure steady progress and improvement."
    }
  ];

  return (
    <Box sx={{ 
      backgroundColor: colors.background.default,
      py: { xs: 8, md: 12 },
      position: "relative",
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={6}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h2"
                sx={{
                  color: colors.text.primary,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  mb: 4,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: designTokens.typography.lineHeight.tight,
                  background: colors.primary.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                The EduGainer's Edge
              </Typography>
              
              <Typography
                variant="h5"
                sx={{
                  color: colors.secondary.main,
                  fontWeight: designTokens.typography.fontWeight.medium,
                  mb: 4,
                  fontSize: "1.5rem",
                }}
              >
                Where Dreams Take Flight
              </Typography>

              <Stack spacing={4}>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text.secondary,
                      fontSize: "1.2rem",
                      lineHeight: designTokens.typography.lineHeight.relaxed,
                      mb: 3,
                    }}
                  >
                    Embark on a transformative journey with EduGainer's, where every
                    class is a stepping stone to greatness. Our dynamic approach blends
                    cutting-edge pedagogy with personalized mentoring, creating an
                    electrifying learning environment that ignites your potential.
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text.secondary,
                      fontSize: "1.2rem",
                      lineHeight: designTokens.typography.lineHeight.relaxed,
                    }}
                  >
                    From cracking the code of JEE and NEET to conquering board exams and
                    government recruitments like SSC CGL and Uttarakhand LT, we're your
                    steadfast companion in every academic endeavor.
                  </Typography>
                </Box>

                {/* Quote section */}
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  sx={{
                    p: 4,
                    background: colors.background.paper,
                    borderRadius: designTokens.borderRadius.xl,
                    border: `1px solid ${colors.border.light}`,
                    borderLeft: `4px solid ${colors.secondary.main}`,
                    position: "relative",
                  }}
                >
                  <QuoteIcon 
                    sx={{ 
                      position: "absolute",
                      top: 16,
                      right: 16,
                      color: colors.secondary.main,
                      opacity: 0.3,
                      fontSize: "2rem",
                    }} 
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: colors.text.primary,
                      fontStyle: "italic",
                      fontSize: "1.1rem",
                      lineHeight: 1.6,
                      mb: 2,
                    }}
                  >
                    "Our expert faculty doesn't just teach; they inspire, challenge, 
                    and nurture your intellect, paving the way for unparalleled success."
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.text.muted,
                      fontWeight: designTokens.typography.fontWeight.medium,
                    }}
                  >
                    - EduGainer's Teaching Philosophy
                  </Typography>
                </MotionCard>
              </Stack>
            </MotionBox>
          </Grid>

          {/* Right Content - Approach Cards */}
          <Grid item xs={12} lg={6}>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Grid container spacing={3}>
                {approaches.map((approach, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <MotionCard
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                      sx={{
                        p: 3,
                        height: "100%",
                        background: colors.background.paper,
                        borderRadius: designTokens.borderRadius.xl,
                        border: `1px solid ${colors.border.light}`,
                        boxShadow: colors.shadow.md,
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: colors.shadow.lg,
                          border: `1px solid ${colors.primary.light}`,
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: colors.primary.gradient,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Stack spacing={2} sx={{ height: "100%" }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            background: colors.primary.gradient,
                            color: colors.text.inverse,
                            fontSize: "1.5rem",
                          }}
                        >
                          {approach.icon}
                        </Avatar>
                        
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              color: colors.text.primary,
                              fontWeight: designTokens.typography.fontWeight.semibold,
                              mb: 1,
                              fontSize: "1.1rem",
                            }}
                          >
                            {approach.title}
                          </Typography>
                          
                          <Typography
                            variant="body2"
                            sx={{
                              color: colors.text.secondary,
                              lineHeight: 1.6,
                              fontSize: "0.95rem",
                            }}
                          >
                            {approach.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          </Grid>
        </Grid>

        {/* Divider with stats */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          sx={{ mt: 10 }}
        >
          <Divider sx={{ mb: 6, borderColor: colors.border.medium }} />
          
          <Grid container spacing={4} sx={{ textAlign: "center" }}>
            {[
              { number: "15+", label: "Years of Excellence" },
              { number: "10,000+", label: "Success Stories" },
              { number: "50+", label: "Expert Faculty" },
              { number: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Typography
                  variant="h3"
                  sx={{
                    color: colors.primary.main,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    mb: 1,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text.secondary,
                    fontSize: "1rem",
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}
                >
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ApproachSection;
