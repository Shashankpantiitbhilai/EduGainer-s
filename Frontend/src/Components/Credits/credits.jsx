import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Link,
  Collapse,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  Chip,
  styled,
  Tooltip,
  Container,
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Twitter,
  Mail,
  Language,
  School,
  Code,
  ExpandMore as ExpandMoreIcon,
  Instagram,
  Facebook,
} from "@mui/icons-material";
import url from "../../images/shashank.jpg";
import { colors, designTokens, glassMorphism, hoverScale } from '../../theme/enterpriseTheme';

// Styled components
const StyledCard = styled(Card)({
  padding: designTokens.spacing.xl,
  borderRadius: designTokens.borderRadius.xl,
  ...glassMorphism(0.1),
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  border: `1px solid ${colors.border.light}`,
  maxWidth: 800,
  margin: "auto",
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: colors.shadow.lg,
  },
});

const SocialIconWithLabel = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: designTokens.spacing.sm,
});

const IconLabel = styled(Typography)({
  fontSize: "0.75rem",
  color: colors.text.secondary,
  fontWeight: designTokens.typography.fontWeight.medium,
});

const AnimatedAvatar = styled(Avatar)({
  width: 160,
  height: 160,
  margin: "auto",
  border: `4px solid ${colors.primary.main}`,
  boxShadow: colors.shadow.lg,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: colors.shadow.xl,
  },
});

const SocialIcon = styled(IconButton)(({ socialcolor }) => ({
  color: socialcolor || colors.primary.main,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    color: colors.primary.light,
    transform: 'scale(1.2)',
    backgroundColor: `${colors.primary.main}20`,
  },
}));

const AnimatedChip = styled(Chip)({
  margin: designTokens.spacing.xs,
  background: colors.secondary.gradient,
  color: colors.text.inverse,
  fontWeight: designTokens.typography.fontWeight.medium,
  borderRadius: designTokens.borderRadius.lg,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1)',
  },
});

const CreditItem = ({ title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box mb={2}>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => setOpen(!open)}
        sx={{
          cursor: "pointer",
          p: 2,
          borderRadius: designTokens.borderRadius.lg,
          transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
          '&:hover': {
            backgroundColor: colors.background.subtle,
          },
        }}
      >
        <IconButton
          component="span"
          size="small"
          sx={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
            color: colors.primary.main,
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: designTokens.typography.fontWeight.bold,
            color: colors.text.primary,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Collapse in={open}>
        <List sx={{ pl: 4 }}>
          {items.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText 
                primary={item} 
                sx={{
                  '& .MuiListItemText-primary': {
                    color: colors.text.secondary,
                    fontSize: '0.95rem',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

const EduGainerCredits = () => {
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
      color: "#333",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/shashankpant12",
      color: "#1DA1F2",
    },
  ];

  const credits = [
    {
      title: "Educational Background",
      items: [
        "B.Tech. in Computer Science & Engineering - IIT Bhilai (2022-2026)",
        "Higher Secondary Education - DPS Mathura Road, New Delhi (2020-2022)",
        "Secondary Education - DPS Mathura Road, New Delhi (2020)",
      ],
    },
    {
      title: "Technical Skills",
      items: [
        "Frontend: React.js, HTML5, CSS3, JavaScript (ES6+), Material-UI",
        "Backend: Node.js, Express.js, RESTful APIs, WebSockets",
        "Database: MongoDB, Redis for caching",
        "Tools: Git, Docker, CI/CD pipelines",
        "Programming Languages: C++, Python, JavaScript",
        "Cloud Services: AWS, Vercel, Netlify",
      ],
    },
    {
      title: "Achievements",
      items: [
        "Completed 600+ DSA challenges on LeetCode, CodeChef, and Codeforces",
        "Finalist at Dark Pattern Buster Hackathon, Government of India",
        "3-star Coder on CodeChef (max rating: 1622)",
        "Pupil status on Codeforces (max rating: 1280)",
        "AIR 21 in AlgoUniversity Graph Contest",
      ],
    },
    {
      title: "Role in EduGainer's",
      items: [
        "Led the development of the entire web application from conception to deployment",
        "Implemented real-time features using WebSockets",
        "Designed and optimized the database schema for efficient data retrieval and storage",
        "Integrated payment gateways and implemented secure user authentication",
        "Developed a responsive and intuitive user interface using React.js",
        "Set up CI/CD pipelines for automated testing and deployment",
        "Implemented caching strategies using Redis to improve application performance",
      ],
    },
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh",
      background: colors.background.gradient,
      py: 6,
    }}>
      <Container maxWidth="md">
        <StyledCard elevation={24}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: colors.primary.main,
                fontWeight: designTokens.typography.fontWeight.bold,
                mb: 2,
              }}
            >
              Tech Lead
            </Typography>
          </Box>

          {/* Profile Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <AnimatedAvatar src={url} alt="Shashank Pant" />
            <Typography 
              variant="h4" 
              sx={{ 
                mt: 3,
                mb: 1,
                fontWeight: designTokens.typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Shashank Pant
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: colors.primary.main,
                fontWeight: designTokens.typography.fontWeight.bold,
                mb: 1,
              }}
            >
              Chief Technology Officer
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: colors.text.secondary,
                mb: 3,
              }}
            >
              3rd Year CSE Student at IIT Bhilai
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: colors.text.primary,
                lineHeight: 1.7,
                maxWidth: '600px',
                mx: 'auto',
                mb: 4,
              }}
            >
              Passionate about solving complex problems using technology.
              Currently pursuing B.Tech. in Computer Science & Engineering at
              Indian Institute of Technology Bhilai. Enthusiastic learner with a
              keen interest in web development, artificial intelligence, and
              competitive problem-solving.
            </Typography>
            
            {/* Social Links */}
            <Grid container justifyContent="center" spacing={2} sx={{ mb: 4 }}>
              {socialLinks.map((link) => (
                <Grid item key={link.name}>
                  <SocialIconWithLabel>
                    <Tooltip title={link.name}>
                      <SocialIcon
                        href={link.href}
                        aria-label={link.name}
                        socialcolor={link.color}
                        component="a"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <link.icon />
                      </SocialIcon>
                    </Tooltip>
                    <IconLabel>{link.name}</IconLabel>
                  </SocialIconWithLabel>
                </Grid>
              ))}
            </Grid>

            {/* Portfolio Links */}
            <Box>
              <Link
                href="https://shashankpantiitbhilai.github.io/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: colors.primary.main,
                  mr: 3,
                  textDecoration: 'none',
                  fontWeight: designTokens.typography.fontWeight.medium,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
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
                  color: colors.primary.main,
                  textDecoration: 'none',
                  fontWeight: designTokens.typography.fontWeight.medium,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <School sx={{ mr: 0.5, verticalAlign: "middle" }} />
                IIT Bhilai
              </Link>
            </Box>
          </Box>

          {/* Credits Sections */}
          <Box sx={{ mb: 6 }}>
            {credits.map((credit, index) => (
              <CreditItem
                key={index}
                title={credit.title}
                items={credit.items}
              />
            ))}
          </Box>

          {/* Skills Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: designTokens.typography.fontWeight.bold,
                color: colors.text.primary,
              }}
            >
              Key Skills
            </Typography>
            <Box>
              {[
                "React",
                "Node.js",
                "MongoDB",
                "Express",
                "WebSockets",
                "Redis",
                "Docker",
                "AWS",
                "JavaScript",
                "Python",
                "C++",
              ].map((skill) => (
                <AnimatedChip key={skill} label={skill} />
              ))}
            </Box>
          </Box>
        </StyledCard>
      </Container>
    </Box>
  );
};

export default EduGainerCredits;
