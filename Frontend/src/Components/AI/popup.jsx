import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Paper,
  Fab,
  Avatar,
  styled,
  ThemeProvider,
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";
import { lightTheme } from "../../theme";
import robotIcon from "../../images/AI-chatbot.png"; // Make sure to add your robot icon in assets folder

// Custom styled components
const MessageContainer = styled(Box)(({ theme, sender }) => ({
  display: "flex",
  justifyContent: sender === "user" ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(1),
}));

const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1.5),
  maxWidth: "70%",
  borderRadius: theme.spacing(2),
  backgroundColor:
    sender === "user" ? theme.palette.primary.main : theme.palette.grey[100],
  color:
    sender === "user"
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
}));

// Custom Avatar with imported Robot Icon
const AssistantAvatar = ({ size = 40 }) => (
  <Avatar
    sx={{
      width: size,
      height: size,
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

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      content: "Messages will be available soon! Stay tuned for updates.",
    },
  ]);

  const handleSend = () => {
    if (input.trim()) {
      // Add user message to the chat
      setMessages([...messages, { sender: "user", content: input.trim() }]);

      // Simulate bot response with a friendly delay message
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            content:
              "I'm currently under development, but I’ll be ready to assist you soon",
          },
        ]);
      }, 1000); // Simulate a 1-second delay for the bot's response

      // Clear the input
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      {/* Floating chat button */}
      <Fab
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "#1a237e",
          "&:hover": {
            bgcolor: "#000051",
          },
          padding: 0,
          overflow: "hidden",
        }}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={robotIcon}
          alt="Chat"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Fab>

      {/* Chat drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 380 },
            height: "100%",
            bgcolor: "background.default",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#1a237e",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AssistantAvatar size={48} />
            <Typography variant="h6">TutorBot</Typography>
          </Box>
          <IconButton
            color="inherit"
            onClick={() => setIsOpen(false)}
            edge="end"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Messages area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflow: "auto",
            backgroundColor: "background.default",
          }}
        >
          {messages.map((message, index) => (
            <MessageContainer key={index} sender={message.sender}>
              {message.sender === "bot" && <AssistantAvatar size={32} />}
              <MessageBubble
                sender={message.sender}
                elevation={1}
                sx={{
                  bgcolor: message.sender === "user" ? "#1a237e" : "#f5f5f5",
                  color: message.sender === "user" ? "white" : "text.primary",
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
              </MessageBubble>
            </MessageContainer>
          ))}
        </Box>

        {/* Input area */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1a237e",
                  },
                  "&:hover fieldset": {
                    borderColor: "#000051",
                  },
                },
              }}
            />
            <IconButton
              sx={{ color: "#1a237e" }}
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default ChatPopup;
