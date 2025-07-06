import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 

 
  Card, 
  CardContent, 
  CardActions,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  School,
  LibraryBooks,
  Store,
  Chat,
  MenuBook,
  SupportAgent
} from '@mui/icons-material';
import { colors, designTokens, glassMorphism, hoverScale, gradientText } from '../../theme/enterpriseTheme';
import { LoadingContext } from '../../App';
import theme from "../../theme/theme"
const features = [
     {
    icon: <LibraryBooks fontSize="large" />,
    title: "24/7 Library",
    description: "Unlimited access to study resources",
    link: "/library",
  },

 
  {
    icon: <Store fontSize="large" />,
    title: "MeriStationary",
    description: "All your academic supplies in one place",
    link: "/stationary/home",
  },
    {
    icon: <School fontSize="large" />,
    title: "Comprehensive Classes",
    description: "Expert-led coaching for competitive exams",
    link: "/classes",
  },
  {
    icon: <Chat fontSize="large" />,
    title: "Student Support",
    description: "Personalized guidance and doubt clearing",
    link: "/chat/home",
  },
  {
    icon: <MenuBook fontSize="large" />,
    title: "Resources",
    description: "Curated study materials and guides",
    link: "/resources",
  },
  {
    icon: <SupportAgent fontSize="large" />,
    title: "Mentorship",
    description: "One-on-one expert mentoring",
    link: "/chat/home",
  }
];

function TypewriterEffect({ text, speed = 100 }) {
    const theme = useTheme();
  const [displayText, setDisplayText] = useState('');
  const { isDarkMode } = useContext(LoadingContext);
  
  // // useEffect(() => {
  // //   let i = 0;
  // //   const typing = setInterval(() => {
  // //     if (i < text.length) {
  // //       setDisplayText(prevText => prevText + text.charAt(i));
  // //       i++;
  // //     } else {
  // //       clearInterval(typing);
  // //     }
  // //   }, speed);

  //   return () => clearInterval(typing);
  // }, [text, speed]);

  return (
    <Typography 
      variant="h3" 
      
      sx={{ 
        fontWeight: designTokens.typography.fontWeight.bold,
                          color: theme.palette.primary.contrastText,
                          mb: 2,

        fontWeight: designTokens.typography.fontWeight.bold,
        textAlign: 'center',
        minHeight: '80px',
        fontSize: { xs: '2rem', md: '3rem' },
        textShadow: isDarkMode ? 'none' : '2px 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      Welcome to EduGainer's
    
    </Typography>
  );
}

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useContext(LoadingContext);
  const [currentTypewriterText, setCurrentTypewriterText] = useState('');

  useEffect(() => {
    const texts = [
      "W  elcome to EduGainer's",
      "Transforming Dreams into Achievements",
      "Your Path to Academic Excellence"
    ];
    let index = 0;

    const changeText = () => {
      setCurrentTypewriterText(texts[index]);
      index = (index + 1) % texts.length;
    };

    changeText();
    const textInterval = setInterval(changeText, 5000);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <Box sx={{ 
      background: theme.palette.background.default,
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {/* Hero Section with Typewriter */}
      <Box 
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
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
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <TypewriterEffect 
            key={currentTypewriterText}
            text={currentTypewriterText} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.primary.contrastText,
              textAlign: 'center', 
              mt: designTokens.spacing.lg,
              opacity: 0.9,
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: designTokens.typography.fontWeight.medium,
            }}
          >
            Empowering Learners, Inspiring Success
          </Typography>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ 
        mt: { xs: -6, sm: -8, md: -10 }, 
        position: 'relative', 
        zIndex: 10,
        pb: { xs: 6, sm: 8, md: 10 }
      }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={4} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                style={{ height: '100%' }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: designTokens.borderRadius.lg,
                    backgroundColor: theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    overflow: 'hidden',
                    minHeight: { xs: 280, sm: 300, md: 320 },
                    maxHeight: { xs: 320, sm: 340, md: 360 },
                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                    cursor: 'pointer',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                      borderColor: theme.palette.primary.main,
                      '& .feature-icon': {
                        transform: 'scale(1.1)',
                        background: alpha(theme.palette.primary.main, 0.15),
                        color: theme.palette.primary.main,
                      },
                      '& .feature-button': {
                        background: theme.palette.secondary.main,
                        transform: 'translateY(-2px)',
                      }
                    }
                  }}
                >
                  <CardContent 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      flex: 1,
                      p: { xs: 2, sm: 2.5, md: 3 },
                      pb: 1,
                    }}
                  >
                    <Box 
                      className="feature-icon"
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontSize: { xs: 36, sm: 40, md: 44 }, 
                        mb: { xs: 1.5, sm: 2 },
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: designTokens.borderRadius.lg,
                        background: alpha(theme.palette.primary.main, 0.08),
                        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: 64, sm: 72, md: 80 },
                        height: { xs: 64, sm: 72, md: 80 },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontWeight: designTokens.typography.fontWeight.bold,
                        color: theme.palette.text.primary,
                        mb: { xs: 1, sm: 1.5 },
                        fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
                        lineHeight: 1.2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.5,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        mb: 'auto',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ 
                    justifyContent: 'center', 
                    pb: { xs: 2, sm: 2.5, md: 3 },
                    pt: 0,
                  }}>
                    <Button 
                      className="feature-button"
                      variant="contained" 
                      size="small"
                      onClick={() => navigate(feature.link)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: designTokens.borderRadius.md,
                        textTransform: 'none',
                        fontWeight: designTokens.typography.fontWeight.medium,
                        px: { xs: 2.5, sm: 3 },
                        py: { xs: 0.75, sm: 1 },
                        fontSize: { xs: '0.825rem', sm: '0.875rem' },
                        color: theme.palette.primary.contrastText,
                        minWidth: 'auto',
                        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                        }
                      }}
                    >
                      Explore
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;