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
  Paper,
  Chip,
  ThemeProvider,
  createTheme,
  styled,
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
} from "@mui/icons-material";
import url from "../images/shashank.jpg";
// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#FFA000", // Amber
    },
    secondary: {
      main: "#FFD54F", // Amber Light
    },
    background: {
      default: "#FFFDE7", // Very Light Yellow
    },
  },
});

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: "auto",
  background: "rgba(255, 253, 231, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[10],
  animation: "$fadeIn 1s ease-out",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: "auto",
  border: `4px solid ${theme.palette.primary.main}`,
  animation: "$pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 0 0 rgba(255, 160, 0, 0.4)",
    },
    "70%": {
      boxShadow: "0 0 0 10px rgba(255, 160, 0, 0)",
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(255, 160, 0, 0)",
    },
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "scale(1.2)",
  },
  transition: "all 0.3s",
}));

const AnimatedChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  animation: "$popIn 0.5s ease-out",
  "@keyframes popIn": {
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
}));

const CreditItem = ({ title, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box mb={2}>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer" }}
      >
        <IconButton
          component="span"
          size="small"
          sx={{
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.3s",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Collapse in={open}>
        <List>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

const EduGainerCredits = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const credits = [
    {
      title: "Education",
      items: [
        "B.Tech. Computer Science & Engineering, IIT Bhilai (CGPA: 8.76/10.0)",
        "Class 12 (96.80%) & Class 10 (96.60%), CBSE, Rishiram Shikshan Sansthan",
      ],
    },
    {
      title: "Technical Skills",
      items: [
        "Languages: C, C++, JavaScript, Python, SQL",
        "Web Development: HTML, CSS, Node.js, Express.js, React.js, RESTful APIs, WebSockets",
        "Databases & Caching: MongoDB, MySQL, Redis",
        "DevOps & Cloud: Git, GitHub, Docker, Linux, Google Cloud Platform",
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
      title: "Role in EduGainer",
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
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
          padding: 2,
        }}
      >
        <StyledPaper elevation={24}>
          <Typography variant="h3" align="center" gutterBottom color="primary">
            Tech Lead
          </Typography>

          <Box textAlign="center" mb={4}>
            <AnimatedAvatar src={url} alt="Shashank Pant" />
            <Typography variant="h4" gutterBottom>
              Shashank Pant
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Chief Full-Stack Engineer
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              3rd Year CSE Student at IIT Bhilai
            </Typography>
            <Typography variant="body1" paragraph>
              Passionate about solving complex problems using technology.
              Currently pursuing B.Tech. in Computer Science & Engineering at
              Indian Institute of Technology Bhilai. Enthusiastic learner with a
              keen interest in web development, artificial intelligence, and
              competitive problem-solving.
            </Typography>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <SocialIcon
                  href="mailto:shashankp@iitbhilai.ac.in"
                  aria-label="Email"
                >
                  <Mail />
                </SocialIcon>
              </Grid>
              <Grid item>
                <SocialIcon
                  href="https://www.linkedin.com/in/shashankpant12/"
                  aria-label="LinkedIn"
                >
                  <LinkedIn />
                </SocialIcon>
              </Grid>
              <Grid item>
                <SocialIcon
                  href="https://github.com/shashankpantiitbhilai"
                  aria-label="GitHub"
                >
                  <GitHub />
                </SocialIcon>
              </Grid>
              <Grid item>
                <SocialIcon
                  href="https://leetcode.com/shashankpant"
                  aria-label="LeetCode"
                >
                  <Code />
                </SocialIcon>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Link
                href="https://shashankpantiitbhilai.github.io/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                sx={{ mr: 2 }}
              >
                <Language sx={{ mr: 0.5, verticalAlign: "middle" }} />
                Portfolio
              </Link>
              <Link
                href="https://iitbhilai.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                <School sx={{ mr: 0.5, verticalAlign: "middle" }} />
                IIT Bhilai
              </Link>
            </Box>
          </Box>

          <Box mb={4}>
            {credits.map((credit, index) => (
              <CreditItem
                key={index}
                title={credit.title}
                items={credit.items}
              />
            ))}
          </Box>

          <Box textAlign="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              Key Skills
            </Typography>
            {[
              "React",
              "Node.js",
              "MongoDB",
              "Express",
              "WebSockets",
              "Redis",
              "Docker",
            ].map((skill) => (
              <AnimatedChip
                key={skill}
                label={skill}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

     
        </StyledPaper>
      </Box>
    </ThemeProvider>
  );
};

export default EduGainerCredits;
