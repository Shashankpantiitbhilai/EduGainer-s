import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions 
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

const colors = {
  primary: "#006400",
  secondary: "#FFA500",
  background: "#F0F8FF",
  white: "#FFFFFF",
  text: "#333333",
};

const features = [
     {
    icon: <LibraryBooks fontSize="large" />,
    title: "24/7 Library",
    description: "Unlimited access to study resources",
    link: "/library",
  },
  {
    icon: <School fontSize="large" />,
    title: "Comprehensive Classes",
    description: "Expert-led coaching for competitive exams",
    link: "/classes",
  },
 
  {
    icon: <Store fontSize="large" />,
    title: "MeriStationary",
    description: "All your academic supplies in one place",
    link: "/stationary/home",
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
    link: "/mentorship",
  }
];

function TypewriterEffect({ text, speed = 100 }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prevText => prevText + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);

    return () => clearInterval(typing);
  }, [text, speed]);

  return (
    <Typography 
      variant="h3" 
      sx={{ 
        color: colors.white, 
        fontWeight: 'bold', 
        textAlign: 'center',
        minHeight: '80px'
      }}
    >
      {displayText}
      <span style={{ animation: 'blink 0.7s infinite' }}>|</span>
    </Typography>
  );
}

function Home() {
  const navigate = useNavigate();
  const [currentTypewriterText, setCurrentTypewriterText] = useState('');

  useEffect(() => {
    const texts = [
      "Weelcome to EduGainer's",
      "Trransforming Dreams into Achievements",
      "Yoour Path to Academic Excellence"
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
      backgroundColor: colors.background, 
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {/* Hero Section with Typewriter */}
      <Box 
        sx={{
          backgroundColor: colors.primary,
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
        }}
      >
        <Container maxWidth="md">
          <TypewriterEffect 
            key={currentTypewriterText}
            text={currentTypewriterText} 
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: colors.white, 
              textAlign: 'center', 
              mt: 2,
              opacity: 0.8
            }}
          >
            Empowering Learners, Inspiring Success
          </Typography>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ mt: -10, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.2, 
                  type: "spring", 
                  stiffness: 100 
                }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      flex: 1 
                    }}
                  >
                    <Box 
                      sx={{ 
                        color: colors.secondary, 
                        fontSize: 64, 
                        mb: 2 
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate(feature.link)}
                      sx={{
                        borderRadius: '50px',
                        textTransform: 'none'
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