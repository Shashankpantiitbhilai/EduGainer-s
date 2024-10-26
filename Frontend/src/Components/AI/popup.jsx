import React, { useState, useRef, useEffect, useContext } from "react";
import {
  sendMessageToChatbot,
  sendFileToChatbot,
} from "../../services/ai/chatbot";
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
  CircularProgress,
  Zoom,
  Tooltip,
  Button,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
  Clear as ClearIcon,
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
} from "@mui/icons-material";
import { lightTheme } from "../../theme";
import robotIcon from "../../images/AI-chatbot.png";
import { AdminContext } from "../../App";
// Existing styled components remain the same...
const FileUploadPreview = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(1, 0),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.grey[50],
}));

const UploadProgress = styled(LinearProgress)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
  borderRadius: theme.spacing(0.5),
}));

const MessageContainer = styled(Box)(({ theme, sender }) => ({
  display: "flex",
  justifyContent: sender === "user" ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(1),
  opacity: 0,
  transform: "translateY(20px)",
  animation: "slideDown 0.3s ease forwards",
  "@keyframes slideDown": {
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1.5),
  maxWidth: "70%",
  borderRadius: theme.spacing(2),
  backgroundColor: sender === "user" ? "#1a237e" : theme.palette.grey[100],
  color: sender === "user" ? "white" : theme.palette.text.primary,
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    [sender === "user" ? "right" : "left"]: -8,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: sender === "user" ? "0 0 10px 10px" : "0 10px 10px 0",
    borderColor:
      sender === "user"
        ? "transparent transparent transparent #1a237e"
        : "transparent transparent transparent #f5f5f5",
  },
}));

const QuestionButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  textAlign: "left",
  justifyContent: "flex-start",
  textTransform: "none",
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const defaultQuestions = [
  "How can I borrow books from the library?",
  "What classes are currently available at EduGainer's?",
  "How can I track my progress in each subject?",
  "Can you recommend study materials from the library?",
  "How do I purchase stationery items through EduGainer?",
  "Can you help me understand a difficult topic?",
  "What are some tips for preparing for exams?",
  "How can I get personalized learning recommendations?",
  "What resources can help me improve my weak areas?",
  "How do I create a study plan with EduGainer's resources?",
  "What reports are available for tracking my academic performance?",
  "How can I manage my time better for assignments and exams?",
  "Are there any online resources or classes available?",
  "Can you quiz me on topics I’ve studied?",
  "How can I improve my grades in this subject?",
  "What should I do if I don’t understand something in class?",
  "How can I access my teachers' feedback on my assignments?",
  "Can I review past assessments to learn from my mistakes?",
  "What additional books or materials should I read?",
];

const AuthButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const MessagesList = styled(Box)({
  flexGrow: 1,
  overflow: "auto",
  scrollBehavior: "smooth",
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
});

const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 0.5, px: 1 }}>
    <CircularProgress size={8} />
    <CircularProgress size={8} sx={{ animationDelay: "0.2s" }} />
    <CircularProgress size={8} sx={{ animationDelay: "0.4s" }} />
  </Box>
);

const AssistantAvatar = ({ size = 40, pulseAnimation = false }) => (
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
const WelcomePopup = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 90,
  right: 24,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  maxWidth: 250,
  boxShadow: theme.shadows[6],
  backgroundColor: "white",
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

const SuggestedQuestion = styled(Button)(({ theme }) => ({
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

const SuggestedQuestionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const ChatPopup = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [showWelcome, setShowWelcome] = useState(isMobile);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDefaultQuestions, setShowDefaultQuestions] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesContainerRef = useRef(null);

  const initialMessages = [
    {
      sender: "bot",
      content: "👋 Welcome to EduGainer's! I'm your educational assistant.",
    },
    {
      sender: "bot",
      content:
        "I can help you manage classes,manage library, track progress, and optimize your educational workflow. Please sign in or create an account to get started, or explore our features below!",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  const handleQuestionClick = async (question) => {
    setShowDefaultQuestions(false);
    setSuggestedQuestions([]); // Clear previous suggestions

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", content: question }]);

    // Show typing indicator
    setIsTyping(true);

    try {
      const botResponse = await sendMessageToChatbot(question);

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content:
            botResponse.response ||
            "Let me help you with that query about " + question.toLowerCase(),
        },
      ]);

      // Set suggested questions if they exist
      if (
        botResponse.followUpQuestions &&
        Array.isArray(botResponse.followUpQuestions)
      ) {
        setSuggestedQuestions(botResponse.followUpQuestions);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content:
            "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setInput("");
      setSuggestedQuestions([]); // Clear previous suggestions

      // Add user message
      setMessages((prev) => [
        ...prev,
        { sender: "user", content: userMessage },
      ]);

      // Show typing indicator
      setIsTyping(true);

      try {
        // Simulate network delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const botResponse = await sendMessageToChatbot(userMessage);

        // Add bot response
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content:
              botResponse.response ||
              "I apologize, but I didn't quite understand that. Could you please rephrase?",
          },
        ]);

        // Set suggested questions if they exist
        if (
          botResponse.followUpQuestions &&
          Array.isArray(botResponse.followUpQuestions)
        ) {
          setSuggestedQuestions(botResponse.followUpQuestions);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content:
              "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleAuthClick = (type) => {
    window.location.href = type === "login" ? "/login" : "/register";
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const scrollHeight = messagesContainerRef.current.scrollHeight;
      const height = messagesContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;

      messagesContainerRef.current.scrollTo({
        top: maxScrollTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);
  useEffect(() => {
    if (isMobile && showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, showWelcome]);

  // Handle chat open
  const handleChatOpen = () => {
    setIsOpen(true);
    setShowWelcome(false);
  };
  // Ensure scroll on drawer open
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen]);
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/gif",
      ];

      if (file.size > maxSize) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content:
              "File size exceeds 5MB limit. Please choose a smaller file.",
          },
        ]);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content:
              "Invalid file type. Only PDF and images (PNG, JPEG, GIF) are allowed.",
          },
        ]);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Add file message to chat
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          content: `📎 Uploaded: ${selectedFile.name}`,
        },
      ]);

      // Show typing indicator
      setIsTyping(true);

      const response = await sendFileToChatbot(
        selectedFile,
        "Please analyze this file and provide insights.",
        (progress) => setUploadProgress(progress)
      );

      // Add response to chat
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content:
            response.response ||
            "I've analyzed your file. Is there anything specific you'd like to know about it?",
        },
      ]);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content:
            "I apologize, but I had trouble processing your file. Please try again or use a different file.",
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsUploading(false);
      handleFileClear();
    }
  };
  // const handleSend = async () => {
  //   if (input.trim()) {
  //     const userMessage = input.trim();
  //     setInput("");

  //     // Add user message
  //     setMessages((prev) => [
  //       ...prev,
  //       { sender: "user", content: userMessage },
  //     ]);

  //     // Show typing indicator
  //     setIsTyping(true);

  //     try {
  //       // Simulate network delay for better UX
  //       await new Promise((resolve) => setTimeout(resolve, 1000));

  //       const botResponse = await sendMessageToChatbot(userMessage);
  //       const followUpQuestion = botResponse.followUpQuestions
  //       follo qup ques is an array haivng three subarray as elements extract the contne tof each subarray and display them as suggeested question after asking any question to chatbot
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           sender: "bot",
  //           content:
  //             botResponse.response ||
  //             "I apologize, but I didn't quite understand that. Could you please rephrase?",
  //         },
  //       ]);
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           sender: "bot",
  //           content:
  //             "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
  //         },
  //       ]);
  //     } finally {
  //       setIsTyping(false);
  //     }
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      {!isOpen && (
        <>
          {showWelcome && (
            <WelcomePopup>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                👋 Hey there!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Need assistance with our website? I'm your Classmate chatbot,
                here to help with any queries you have about the site or
                anything else you need!
              </Typography>
            </WelcomePopup>
          )}
          <Tooltip title="Chat with ClassMate" placement="left" arrow>
            <Zoom in={true}>
              <Fab
                sx={{
                  position: "fixed",
                  bottom: 24,
                  right: 24,
                  bgcolor: "#1a237e",
                  "&:hover": {
                    bgcolor: "#000051",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                  padding: 0,
                  overflow: "hidden",
                }}
                onClick={handleChatOpen}
              >
                <AssistantAvatar pulseAnimation={true} />
              </Fab>
            </Zoom>
          </Tooltip>
        </>
      )}

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 380 },
            height: "100%",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(45deg, orange 100%, #534bae 90%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <AssistantAvatar size={48} />
            <Box>
              <Typography variant="h6">ClassMate</Typography>
              <Typography variant="caption">Your Educational Helper</Typography>
            </Box>
            <IconButton
              color="inherit"
              onClick={() => setIsOpen(false)}
              sx={{ ml: "auto" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {!IsUserLoggedIn && (
            <AuthButtons>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={() => handleAuthClick("login")}
                sx={{ bgcolor: "white", color: "#1a237e" }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SignUpIcon />}
                onClick={() => handleAuthClick("register")}
                sx={{ borderColor: "white", color: "white" }}
              >
                Create Account
              </Button>
            </AuthButtons>
          )}
        </Box>

        <MessagesList ref={messagesContainerRef}>
          <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            {messages.map((message, index) => (
              <MessageContainer key={index} sender={message.sender}>
                {message.sender === "bot" && <AssistantAvatar size={32} />}
                <MessageBubble sender={message.sender} elevation={1}>
                  <Typography variant="body1">{message.content}</Typography>
                  {message.sender === "bot" &&
                    index === messages.length - 1 &&
                    suggestedQuestions.length > 0 && (
                      <SuggestedQuestionsContainer>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Follow-up Questions:
                        </Typography>
                        {suggestedQuestions.map((question, qIndex) => (
                          <SuggestedQuestion
                            key={qIndex}
                            variant="text"
                            size="small"
                            onClick={() => handleQuestionClick(question)}
                          >
                            {question}
                          </SuggestedQuestion>
                        ))}
                      </SuggestedQuestionsContainer>
                    )}
                </MessageBubble>
              </MessageContainer>
            ))}
            {isTyping && (
              <MessageContainer sender="bot">
                <AssistantAvatar size={32} />
                <MessageBubble sender="bot" elevation={1}>
                  <TypingIndicator />
                </MessageBubble>
              </MessageContainer>
            )}
            {showDefaultQuestions && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Frequently Asked Questions:
                </Typography>
                {defaultQuestions.map((question, index) => (
                  <QuestionButton
                    key={index}
                    fullWidth
                    onClick={() => handleQuestionClick(question)}
                  >
                    {question}
                  </QuestionButton>
                ))}
              </Box>
            )}
          </Box>
        </MessagesList>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          {selectedFile && (
            <FileUploadPreview>
              <Typography noWrap sx={{ flex: 1 }}>
                📎 {selectedFile.name}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                {isUploading && (
                  <Typography variant="caption">{uploadProgress}%</Typography>
                )}
                <IconButton
                  size="small"
                  onClick={handleFileClear}
                  disabled={isUploading}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
            </FileUploadPreview>
          )}

          {isUploading && (
            <UploadProgress variant="determinate" value={uploadProgress} />
          )}

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.png,.jpg,.jpeg,.gif"
              style={{ display: "none" }}
            />

            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="outlined"
              placeholder="Ask me anything..."
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isUploading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1a237e",
                  },
                  "&:hover fieldset": {
                    borderColor: "#000051",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1a237e",
                  },
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                color="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isTyping}
                sx={{
                  color: "#1a237e",
                  "&:hover": {
                    bgcolor: "rgba(26, 35, 126, 0.04)",
                  },
                }}
              >
                <AttachFileIcon />
              </IconButton>

              {selectedFile ? (
                <IconButton
                  onClick={handleFileUpload}
                  disabled={isUploading || isTyping}
                  sx={{
                    color: "#1a237e",
                    "&:hover": {
                      bgcolor: "rgba(26, 35, 126, 0.04)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <SendIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || isUploading}
                  sx={{
                    color: "#1a237e",
                    "&:hover": {
                      bgcolor: "rgba(26, 35, 126, 0.04)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <SendIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default ChatPopup;
