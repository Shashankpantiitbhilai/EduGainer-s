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
  
  Fab,

  ThemeProvider,

  Zoom,
  Tooltip,
  Button,

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
import robotIcon from "../../images/AI-chatbot.jpg";
import { AdminContext } from "../../App";
import SoundControl from './soundMode';
import {defaultQuestions} from "./FAQ"// Existing styled components remain the same...
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
// ... (keep existing imports)
import AudioInput from './mic';
import {
  AuthButtons, TypingIndicator, AssistantAvatar, WelcomePopup,
  SuggestedQuestion, MessageLink, SuggestedQuestionsContainer, MessageActions, ActionButton,
  MessagesList, MessageContainer, MessageBubble, BetaTag, BetaNote,
  FileUploadPreview, UploadProgress, getTimeBasedGreeting, QuestionButton
} from "./ui";
import LanguageControl from "./langChange"
// In the ChatPopup component, add the handleAudioInput function



const ChatPopup = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const theme = useTheme();
  const [feedback, setFeedback] = useState({});
 const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const handleFeedback = (messageId, type) => {
    setFeedback((prev) => ({
      ...prev,
      [messageId]: type,
    }));
    // Here you can add API call to send feedback to backend
  };


  const handleSoundToggle = (isOn) => {
    setSoundEnabled(isOn);
    // Add text-to-speech logic here
  };

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    // Add language change logic here
    // You might want to update the UI text and potentially reload messages
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [showWelcome, setShowWelcome] = useState(true);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showDefaultQuestions, setShowDefaultQuestions] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesContainerRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const handleCopyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  const initialMessages = [
    {
      sender: "bot",
      content:
        "👋 Hi there! Welcome to EduGainer's! I’m Aiden, your friendly guide.",
      time: 0,
    },
    {
      sender: "bot",
      content:
        "I’m here to help you with everything from managing your classes to exploring our library. Just sign in or create an account to get started, and let’s make your learning journey fun and easy!",
      time: 0,
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  const handleQuestionClick = async (question) => {
    setShowDefaultQuestions(false);
    setSuggestedQuestions([]);

    setMessages((prev) => [...prev, { sender: "user", content: question }]);
    setIsTyping(true);

    try {
      const botResponse = await sendMessageToChatbot(question,currentLanguage);
      console.log(botResponse.link);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          content:
            botResponse.response ||
            "Let me help you with that query about " + question.toLowerCase(),
          link: botResponse.link, // Add link to message object
        },
      ]);

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
      console.log("YO")
      const userMessage = input.trim();
      setInput("");
      setSuggestedQuestions([]);

      setMessages((prev) => [
        ...prev,
        { sender: "user", content: userMessage },
      ]);

      setIsTyping(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const botResponse = await sendMessageToChatbot(userMessage);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            content:
              botResponse.response ||
              "I apologize, but I didn't quite understand that. Could you please rephrase?",
            link: botResponse.link, // Add link to message object
          },
        ]);

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
const handleAudioInput = (text) => {
  if (text.trim()) {
    setInput(text);
    console.log("send")
    handleSend();
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
              <Box sx={{ position: "relative" }}>
                <IconButton
                  size="small"
                  onClick={() => setShowWelcome(false)}
                  sx={{
                    position: "absolute",
                    right: -8,
                    top: -8,
                    color: "text.secondary",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  👋 Hi there! 🌟
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Welcome to EduGainer's! <br />
                  I'm Aiden, here to help! <br />
              
                 
                </Typography>
              </Box>
            </WelcomePopup>
          )}
          <Tooltip title="Chat with Aiden" placement="left" arrow>
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
            overflow: "hidden",
          },
        }}
      >
        {/* Header Section with new controls */}
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(45deg, green 100%, #534bae 90%)",
            color: "white",
            flexShrink: 0,
            zIndex: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <AssistantAvatar size={48} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">
                {getTimeBasedGreeting()} I'm Aiden!
              </Typography>
              <Typography variant="caption">
                Here to help you learn and explore!
              </Typography>
            </Box>
            
            {/* Add Sound and Language Controls */}
         
          </Box>

          <BetaTag>BETA</BetaTag>

          <BetaNote>
            Note: Aiden is in beta version and may occasionally make mistakes.
            Please verify important information.
          </BetaNote>

          {!IsUserLoggedIn && (
            <AuthButtons>
              <Button
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => handleAuthClick("login")}
                sx={{
                  bgcolor: "white",
                  color: "#1a237e",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SignUpIcon />}
                onClick={() => handleAuthClick("register")}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.9)",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Create Account
              </Button>
            </AuthButtons>
          )}
        </Box>
   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SoundControl onToggle={handleSoundToggle} />
              <LanguageControl onLanguageChange={handleLanguageChange} />
              <IconButton
                color="inherit"
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
        {/* Messages Section */}
        <MessagesList ref={messagesContainerRef}>
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              minHeight: "min-content",
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <MessageContainer key={index} sender={message.sender}>
                {message.sender === "bot" && <AssistantAvatar size={32} />}
                <MessageBubble
                  sender={message.sender}
                  elevation={1}
                  sx={{
                    position: "relative",
                    "&:hover .message-actions": {
                      opacity: 1,
                    },
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: 2,
                    },
                    pb: 3,
                  }}
                >
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {message.content}
                    </Typography>
                    {message.sender === "bot" && message.link && (
                      <MessageLink
                        href={message.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "inline-block",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        Open Link →
                      </MessageLink>
                    )}
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
                              sx={{
                                textAlign: "left",
                                justifyContent: "flex-start",
                              }}
                            >
                              {question}
                            </SuggestedQuestion>
                          ))}
                        </SuggestedQuestionsContainer>
                      )}
                  </Box>
                  {messages.length > 2 && message?.time !== 0 && (
                    <MessageActions
                      className="message-actions"
                      sender={message.sender}
                    >
                      {message.sender === "bot" && (
                        <>
                          <ActionButton
                            size="small"
                            onClick={() => handleFeedback(index, "like")}
                            sx={{
                              color:
                                message.sender === "user" ? "white" : "inherit",
                              backgroundColor:
                                feedback[index] === "like"
                                  ? "rgba(25, 118, 210, 0.12)"
                                  : "transparent",
                            }}
                          >
                            <Tooltip title="Helpful" placement="top">
                              <ThumbUpIcon
                                fontSize="inherit"
                                sx={{ fontSize: "0.75rem" }} // Adjust icon size
                              />
                            </Tooltip>
                          </ActionButton>
                          <ActionButton
                            size="small"
                            onClick={() => handleFeedback(index, "dislike")}
                            sx={{
                              color:
                                message.sender === "user" ? "white" : "inherit",
                              backgroundColor:
                                feedback[index] === "dislike"
                                  ? "rgba(211, 47, 47, 0.12)"
                                  : "transparent",
                            }}
                          >
                            <Tooltip title="Not helpful" placement="top">
                              <ThumbDownIcon
                                fontSize="inherit"
                                sx={{ fontSize: "0.75rem" }} // Adjust icon size
                              />
                            </Tooltip>
                          </ActionButton>
                        </>
                      )}

                      <ActionButton
                        size="small"
                        onClick={() =>
                          handleCopyMessage(message.content, index)
                        }
                        sx={{
                          color:
                            message.sender === "user" ? "white" : "inherit",
                        }}
                      >
                        <Tooltip
                          title={
                            copiedMessageId === index
                              ? "Copied!"
                              : "Copy message"
                          }
                          placement="top"
                        >
                          <CopyIcon fontSize="small" />
                        </Tooltip>
                      </ActionButton>
                    </MessageActions>
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
              <Box sx={{ mt: 2, width: "100%" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Frequently Asked Questions:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {defaultQuestions[currentLanguage].map((question, index) => (
                    <QuestionButton
                      key={index}
                      fullWidth
                      onClick={() => handleQuestionClick(question)}
                      sx={{
                        textAlign: "left",
                        justifyContent: "flex-start",
                        whiteSpace: "normal",
                        height: "auto",
                        minHeight: "36px",
                      }}
                    >
                      {question}
                    </QuestionButton>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </MessagesList>

        {/* Input Section */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
            flexShrink: 0,
            zIndex: 2,
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
     <AudioInput onInputReceived={handleAudioInput} />
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

              <IconButton
                onClick={selectedFile ? handleFileUpload : handleSend}
                disabled={
                  (!input.trim() && !selectedFile) || isTyping || isUploading
                }
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
            </Box>
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};
export default ChatPopup;