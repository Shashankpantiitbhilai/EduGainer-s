import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Container,
  Card,
  Chip,
  IconButton,
  Link,
  useTheme,
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Mail,
  Language,
  School,
} from "@mui/icons-material";
import url from "../images/shashank.jpg";
import { designTokens } from '../theme/enterpriseTheme';

const EduGainerCredits = () => {
  const theme = useTheme();

  const socialLinks = [
    {
      name: "Email",
      icon: Mail,
      href: "mailto:shashankp@iitbhilai.ac.in",
      color: "#D44638",
    },
    {
      name: "LinkedIn", 
      icon: LinkedIn,
      href: "https://www.linkedin.com/in/shashankpant12/",
      color: "#0077B5",
    },
    {
      name: "GitHub",
      icon: GitHub,
      href: "https://github.com/shashankpantiitbhilai",
      color: theme.palette.mode === 'dark' ? "#ffffff" : "#333333",
    },
  ];

  const skills = [
    "React", "Node.js", "MongoDB", "Express", "WebSockets", 
    "Redis", "Docker", "AWS", "JavaScript", "Python", "C++"
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh",
      bgcolor: theme.palette.background.default,
      py: 6,
    }}>
      <Container maxWidth="md">
        <Card
          sx={{
            p: 6,
            borderRadius: designTokens.borderRadius.xl,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center',
            boxShadow: theme.shadows[3],
          }}
        >
          {/* Header */}
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: designTokens.typography.fontWeight.bold,
              mb: 4,
            }}
          >
            Tech Lead
          </Typography>

          {/* Profile */}
          <Avatar
            src={url}
            alt="Shashank Pant"
            sx={{
              width: 160,
              height: 160,
              margin: "auto",
              border: `4px solid ${theme.palette.primary.main}`,
              mb: 3,
            }}
          />
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            Shashank Pant
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: designTokens.typography.fontWeight.semibold,
              mb: 1,
            }}
          >
            Chief Technology Officer
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
              mb: 3,
            }}
          >
            3rd Year CSE Student at IIT Bhilai
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.text.primary,
              lineHeight: 1.7,
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Passionate about solving complex problems using technology.
            Currently pursuing B.Tech. in Computer Science & Engineering at
            Indian Institute of Technology Bhilai. Led the development of 
            EduGainer's platform from conception to deployment.
          </Typography>
          
          {/* Social Links */}
          <Box sx={{ mb: 4 }}>
            {socialLinks.map((link) => (
              <IconButton
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: link.color,
                  mx: 1,
                  transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing}`,
                  '&:hover': {
                    transform: 'scale(1.2)',
                  },
                }}
              >
                <link.icon fontSize="large" />
              </IconButton>
            ))}
          </Box>

          {/* Portfolio Links */}
          <Box sx={{ mb: 4 }}>
            <Link
              href="https://shashankpantiitbhilai.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: theme.palette.primary.main,
                mr: 3,
                textDecoration: 'none',
                fontWeight: designTokens.typography.fontWeight.medium,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <Language sx={{ mr: 0.5, verticalAlign: "middle" }} />
              Portfolio
            </Link>
            <Link
              href="https://iitbhilai.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: designTokens.typography.fontWeight.medium,
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <School sx={{ mr: 0.5, verticalAlign: "middle" }} />
              IIT Bhilai
            </Link>
          </Box>

          {/* Skills */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3,
              fontWeight: designTokens.typography.fontWeight.bold,
              color: theme.palette.text.primary,
            }}
          >
            Key Skills
          </Typography>
          <Box>
            {skills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                sx={{
                  m: 0.5,
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  fontWeight: designTokens.typography.fontWeight.medium,
                  transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing}`,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              />
            ))}
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default EduGainerCredits;
