import React from "react";
import { Box, Button, Paper, IconButton, Avatar, Typography, Link, CircularProgress, LinearProgress } from "@mui/material";
import { styled } from "@mui/system";
import robotIcon from "../../images/AI-chatbot.jpg"; // Update with your actual icon path

// Styled components
export const AuthButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 0.5, px: 1 }}>
    <CircularProgress size={8} />
    <CircularProgress size={8} sx={{ animationDelay: "0.2s" }} />
    <CircularProgress size={8} sx={{ animationDelay: "0.4s" }} />
  </Box>
);

export const AssistantAvatar = ({ size = 40, pulseAnimation = false }) => (
  <Avatar
    sx={{
      width: size,
      height: size,
      animation: pulseAnimation ? "pulse 2s infinite" : "none",
      "@keyframes pulse": {
        "0%": { transform: "scale(1)" },
        "50%": { transform: "scale(1.1)" },
        "100%": { transform: "scale(1)" },
      },
      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
    }}
    src={robotIcon}
    alt="AI Assistant"
  />
);

export const WelcomePopup = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 80, // You can adjust this value as needed
  right: -16,  // Move it closer to the right side of the screen
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  maxWidth: 300,
  boxShadow: theme.shadows[6],
  animation: "slideUp 0.3s ease-out",

  "@keyframes slideUp": {
    from: {
      opacity: 0,
      transform: "translateY(20px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -10,
    right: 20,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: "10px 10px 0 10px",
    borderColor: "white transparent transparent transparent",
  },
}));

export const SuggestedQuestion = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  textAlign: "left",
  justifyContent: "flex-start",
  textTransform: "none",
  backgroundColor: "rgba(26, 35, 126, 0.08)",
  color: "#1a237e",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(0.5, 2),
  "&:hover": {
    backgroundColor: "rgba(26, 35, 126, 0.15)",
  },
}));

export const MessageLink = styled(Link)(({ theme }) => ({
  color: "white",
  backgroundColor: "#1a237e",
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(1.5),
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#000051",
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },
}));

export const SuggestedQuestionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const MessageActions = styled(Box)(({ theme, sender }) => ({
  display: "flex",
  gap: "2px",
  alignItems: "center",
  position: "absolute",
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  backgroundColor:
    sender === "user" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.9)",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5),
}));

export const ActionButton = styled(IconButton)(({ theme, sender }) => ({
  padding: 4,
  "&:hover": {
    backgroundColor:
      sender === "user" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.04)",
  },
}));

export const MessagesList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  scrollBehavior: "smooth",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  maxHeight: "calc(100vh - 200px)", // Account for header and input area
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "3px",
    "&:hover": {
      background: "#666",
    },
  },
}));

export const MessageContainer = styled(Box)(({ theme, sender }) => ({
  display: "flex",
  justifyContent: sender === "user" ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(1),
  opacity: 0,
  transform: "translateY(20px)",
  animation: "slideDown 0.3s ease forwards",
  width: "100%",
  padding: theme.spacing(0, 2),
  maxWidth: "100%",
  "@keyframes slideDown": {
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

export const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1.5),
  maxWidth: "80%", // Increased from 70% to allow more content
  width: "fit-content",
  borderRadius: theme.spacing(2),
  backgroundColor: sender === "user" ? "#1a237e" : theme.palette.grey[100],
  color: sender === "user" ? "white" : theme.palette.text.primary,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  overflowWrap: "break-word",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  "& a": {
    wordBreak: "break-all",
  },

  [theme.breakpoints.down("sm")]: {
    maxWidth: "85%", // Even more width on mobile
  },
}));

export const BetaTag = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 40,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  padding: "2px 8px",
  borderRadius: "0 0 4px 4px",
  fontSize: "0.75rem",
  fontWeight: 500,
}));

export const BetaNote = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: "rgba(255, 255, 255, 0.7)",
  marginTop: theme.spacing(1),
}));

export const FileUploadPreview = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(1, 0),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.grey[50],
}));

export const UploadProgress = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
  borderRadius: theme.spacing(0.5),
}));

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning!";
  if (hour < 18) return "Good afternoon!";
  return "Good evening!";
};

export const QuestionButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  textAlign: "left",
  justifyContent: "flex-start",
  textTransform: "none",
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  maxWidth: "100%",
  padding: theme.spacing(1, 2),
  whiteSpace: "normal",
  wordWrap: "break-word",
  height: "auto",
  minHeight: theme.spacing(4),
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));
