import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Paper,
  Badge,
  useMediaQuery,
  useTheme,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Container,
  Fade,
  styled,
  alpha,
} from "@mui/material";
import {
  Send as SendIcon,
  Announcement,
  Person,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  Chat as ChatIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import io from "socket.io-client";
import { AdminContext } from "../../App";
import {
  fetchChatMessages,
  postChatMessages,
  fetchAdminCredentials,
  fetchUnseenMessages,
  updateSeenMessage,
} from "../../services/chat/utils";
import { fetchAllChats } from "../../services/Admin_services/adminUtils";
import ChatInput from "./chatInput";
import { designTokens, glassMorphism } from '../../theme/enterpriseTheme';
import { showErrorToast } from "../../utils/notificationUtils";

// Styled components for enterprise-level chat UI
const ChatContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
    : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  ...glassMorphism(theme.palette.mode === 'dark' ? 0.05 : 0.02),
  backdropFilter: 'blur(20px)',
  position: 'relative',
  overflow: 'hidden',
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const ChatListItem = styled(ListItem)(({ theme, selected }) => ({
  margin: theme.spacing(1, 2),
  borderRadius: designTokens.borderRadius.lg,
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  backgroundColor: selected 
    ? alpha(theme.palette.primary.main, 0.1)
    : 'transparent',
  border: selected 
    ? `2px solid ${alpha(theme.palette.primary.main, 0.3)}`
    : `2px solid transparent`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateX(4px)',
    boxShadow: theme.shadows[2],
  },
}));

const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  padding: theme.spacing(2, 3),
  maxWidth: '75%',
  borderRadius: designTokens.borderRadius.xl,
  position: 'relative',
  ...glassMorphism(0.05),
  backgroundColor: isOwn 
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : theme.palette.background.paper,
  color: isOwn 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  border: `1px solid ${isOwn 
    ? alpha(theme.palette.primary.main, 0.3)
    : theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  '&::before': isOwn ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    borderRadius: 'inherit',
    pointerEvents: 'none',
  } : {},
}));

const ChatHeader = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  ...glassMorphism(0.02),
  backdropFilter: 'blur(20px)',
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  maxWidth: 500,
  margin: theme.spacing(2),
  borderRadius: designTokens.borderRadius.xxl,
  border: `1px solid ${theme.palette.divider}`,
  ...glassMorphism(0.05),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[8],
}));

const Chat = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error,setError]=useState("")
  const [announcementMessages, setAnnouncementMessages] = useState([]);
  const [adminRoomId, setAdminRoomId] = useState("");
  const socketRef = useRef(null);
  const [userRoomId, setUserRoomId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const messagesEndRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({
    announcements: 0,
    admin: 0,
  });
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [isRoomSelected, setIsRoomSelected] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchAndUpdateUnseenMessages = async () => {
    try {
      const unseenMessages = await fetchUnseenMessages(userRoomId);
      let adminCount = 0;
      let announcementCount = 0;

      unseenMessages.forEach(msg => {
        if (msg.messages[0].receiver === "All") {
          announcementCount++;
        } else if (msg.user === IsUserLoggedIn?._id) {
          adminCount++;
        }
      });

      setUnreadCounts({
        announcements: announcementCount,
        admin: adminCount,
      });
    } catch (error) {
      console.error("Error fetching unseen messages:", error);
    }
  };

  useEffect(() => {
    if (IsUserLoggedIn) {
      fetchAndUpdateUnseenMessages();
    }
  }, [IsUserLoggedIn]);

  useEffect(() => {
    const fetchAdminAndMessages = async () => {
      try {
        const [chatData, adminData] = await Promise.all([
          fetchChatMessages(),
          fetchAdminCredentials(),
        ]);
        if (adminData) {
          setMessages(chatData);
          const admin = adminData;
          const user_id = IsUserLoggedIn._id;
          const admin_id = admin._id;

          setAdminRoomId(admin_id);
          setUserRoomId(user_id);

          const url =
            process.env.NODE_ENV === "production"
              ? process.env.REACT_APP_BACKEND_PROD
              : process.env.REACT_APP_BACKEND_DEV;
          const socket = io(url, {
            query: {
              sender: IsUserLoggedIn._id,
              admin: admin._id,
            },
          });

          socketRef.current = socket;

          socket.on("receiveMessage", (message, roomId, sender) => {
            if (roomId === admin_id) {
              setAnnouncementMessages((prevMessages) => [
                ...prevMessages,
                message,
              ]);
              if (user_id !== sender) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  announcements: prev.announcements + 1,
                }));
              }
            } else {
              setMessages((prevMessages) => [...prevMessages, message]);
              if (user_id !== sender) {
                setUnreadCounts((prev) => ({
                  ...prev,
                  admin: prev.admin + 1,
                }));
              }
            }

            scrollToBottom();  // Ensure scrolling on new message
          });

          return () => {
            socket.disconnect();
          };
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    if (IsUserLoggedIn) {
      fetchAdminAndMessages();
    }
  }, [IsUserLoggedIn]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, announcementMessages]); // Trigger scroll when messages update

  const sendMessage = async (message) => {
    if (!isRoomSelected) {
      console.log("isRoomSelected is false");
      return;
    }

    if (selectedRoom === adminRoomId && adminRoomId !== userRoomId) {
      setError(
        "You are not authorized to send messages in the announcement room."
      );
    } else {
      const messageData = {
        messages: [
          {
            sender: IsUserLoggedIn._id,
            receiver: adminRoomId,
            content: message,
          },
        ],
        user: IsUserLoggedIn._id,
        timestamp: new Date(),
      };
      try {
        await postChatMessages(messageData);
        if (socketRef.current) {
          socketRef.current.emit(
            "sendMessage",
            messageData,
            selectedRoom,
            userRoomId
          );
        }

        setInput("");
        setError("");
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleRoomClick = async (id) => {
    try {
      setSelectedRoom(id);
      setIsRoomSelected(true);
      updateSeenMessage(id);
      const response = await fetchAllChats(id);
      const roomId = id;

      if (id === adminRoomId) {
        setAnnouncementMessages(response);
        setUnreadCounts((prev) => ({ ...prev, announcements: 0 }));
      } else {
        setMessages(response);
        setUnreadCounts((prev) => ({ ...prev, admin: 0 }));
      }

      if (socketRef.current) {
        socketRef.current.emit("joinRoom", roomId);
        socketRef.current.emit("onSeen", id, userRoomId);
      }

      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const ChatSidebar = () => (
    <SidebarContainer sx={{ width: isMobile ? 280 : "100%" }}>
      <SidebarHeader>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Avatar
            alt="EduGainer's"
            src="../../images/logo.jpg"
            sx={{ 
              width: 80, 
              height: 80, 
              mx: "auto", 
              mb: 2,
              border: `3px solid ${theme.palette.secondary.main}`,
              boxShadow: theme.shadows[4],
            }}
          />
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 1,
              fontWeight: designTokens.typography.fontWeight.bold,
            }}
          >
            Query Portal
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.9,
              fontWeight: designTokens.typography.fontWeight.medium,
            }}
          >
            Connect with our experts
          </Typography>
        </Box>
      </SidebarHeader>
      
      <Box sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            color: theme.palette.text.primary,
            fontWeight: designTokens.typography.fontWeight.bold,
          }}
        >
          Conversations
        </Typography>
        
        <List sx={{ p: 0 }}>
          <ChatListItem
            button
            selected={selectedRoom === adminRoomId}
            onClick={() => handleRoomClick(adminRoomId)}
            sx={{ mb: 2 }}
          >
            <Badge 
              badgeContent={unreadCounts.announcements} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                  fontWeight: designTokens.typography.fontWeight.bold,
                }
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main,
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                <Announcement />
              </Avatar>
            </Badge>
            <ListItemText 
              primary={
                <Typography 
                  sx={{ 
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    color: theme.palette.text.primary,
                  }}
                >
                  Announcements
                </Typography>
              }
              secondary={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                  }}
                >
                  {announcementMessages.length} messages
                </Typography>
              }
            />
          </ChatListItem>
          
          <ChatListItem
            button
            selected={selectedRoom === userRoomId}
            onClick={() => handleRoomClick(userRoomId)}
          >
            <Badge 
              badgeContent={unreadCounts.admin} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                  fontWeight: designTokens.typography.fontWeight.bold,
                }
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2,
                  width: 48,
                  height: 48,
                }}
              >
                <ChatIcon />
              </Avatar>
            </Badge>
            <ListItemText 
              primary={
                <Typography 
                  sx={{ 
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    color: theme.palette.text.primary,
                  }}
                >
                  Admin Support
                </Typography>
              }
              secondary={
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                  }}
                >
                  {messages.length} messages
                </Typography>
              }
            />
          </ChatListItem>
        </List>
      </Box>
      
      <Box sx={{ 
        p: 3, 
        mt: "auto",
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1,
        }}>
          <LockIcon sx={{ 
            fontSize: '1rem', 
            color: theme.palette.success.main,
          }} />
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: designTokens.typography.fontWeight.medium,
            }}
          >
            End-to-end encrypted
          </Typography>
        </Box>
      </Box>
    </SidebarContainer>
  );

  const ChatContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'transparent',
      }}
    >
      <ChatHeader 
        position="static" 
        color="inherit" 
        elevation={0}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 80 } }}>
          {isMobile && (
            <IconButton 
              edge="start" 
              onClick={handleDrawerToggle} 
              sx={{ 
                mr: 2,
                borderRadius: designTokens.borderRadius.sm,
                transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'scale(1.05)',
                },
              }}
            >
              {drawerOpen ? <ArrowBackIcon /> : <MenuIcon />}
            </IconButton>
          )}
          <Avatar
            sx={{
              backgroundColor: selectedRoom === adminRoomId 
                ? theme.palette.warning.main 
                : theme.palette.primary.main,
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            {selectedRoom === adminRoomId ? <Announcement /> : <ChatIcon />}
          </Avatar>
          <Box>
            <Typography 
              variant="h6" 
              sx={{
                color: theme.palette.text.primary,
                fontWeight: designTokens.typography.fontWeight.bold,
              }}
            >
              {selectedRoom === adminRoomId ? "Announcements" : "Admin Support"}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              {selectedRoom === adminRoomId 
                ? "Official announcements and updates"
                : "Get help from our support team"
              }
            </Typography>
          </Box>
        </Toolbar>
      </ChatHeader>

      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: "auto", 
          p: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)'
            : 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.01) 100%)',
        }}
      >
        {!isRoomSelected ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <ChatIcon sx={{ fontSize: '2.5rem' }} />
              </Avatar>
              <Typography 
                variant="h5" 
                sx={{
                  mb: 2,
                  color: theme.palette.text.primary,
                  fontWeight: designTokens.typography.fontWeight.bold,
                }}
              >
                Welcome to Query Portal
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                }}
              >
                Select a conversation from the sidebar to start chatting with our support team
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            {(selectedRoom === adminRoomId ? announcementMessages : messages).map((msg, index) => (
              <Fade in={true} timeout={300} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: msg.messages[0].sender === IsUserLoggedIn._id ? "flex-end" : "flex-start",
                    mb: 3,
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    '@keyframes slideIn': {
                      from: {
                        opacity: 0,
                        transform: 'translateY(20px)',
                      },
                      to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  <MessageBubble
                    elevation={0}
                    isOwn={msg.messages[0].sender === IsUserLoggedIn._id}
                  >
                    <Typography 
                      variant="body1"
                      sx={{
                        lineHeight: 1.5,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {msg.messages[0].content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: "block", 
                        mt: 1,
                        opacity: 0.8,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </MessageBubble>
                </Box>
              </Fade>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {selectedRoom !== adminRoomId || adminRoomId === userRoomId ? (
        <Box sx={{ 
          p: 3, 
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          ...glassMorphism(0.02),
        }}>
          <ChatInput 
            onSendMessage={(message) => {
              setInput(message);
              sendMessage(message);
            }}
            isRoomSelected={isRoomSelected}
          />
        </Box>
      ) : (
        <Box sx={{ 
          p: 3, 
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          borderTop: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 2,
          }}>
            <LockIcon sx={{ color: theme.palette.warning.main }} />
            <Typography 
              sx={{
                color: theme.palette.warning.main,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}
            >
              You cannot send messages in the announcement room
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  if (!IsUserLoggedIn) {
    return (
      <ChatContainer>
        <Container
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Fade in={true} timeout={1000}>
            <WelcomeCard>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              >
                <ChatIcon sx={{ fontSize: '3rem' }} />
              </Avatar>
              <Typography 
                variant="h4" 
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: designTokens.typography.fontWeight.bold,
                  mb: 2,
                }}
              >
                Query Portal
              </Typography>
              <Typography 
                variant="h6" 
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  fontWeight: designTokens.typography.fontWeight.medium,
                  lineHeight: 1.6,
                }}
              >
                Connect with our expert support team for instant assistance
              </Typography>
              <Typography 
                variant="body1" 
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Please log in to access the chat features and get personalized help
              </Typography>
              <Link 
                to="/login"
                style={{ textDecoration: "none" }}
              >
                <Box
                  component="button"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: theme.palette.primary.contrastText,
                    border: 'none',
                    borderRadius: designTokens.borderRadius.lg,
                    padding: theme.spacing(2, 4),
                    fontSize: designTokens.typography.fontSize.lg,
                    fontWeight: designTokens.typography.fontWeight.bold,
                    cursor: 'pointer',
                    transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  Login Now
                </Box>
              </Link>
            </WelcomeCard>
          </Fade>
        </Container>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { 
              width: 280,
              borderRadius: `0 ${designTokens.borderRadius.xl}px ${designTokens.borderRadius.xl}px 0`,
              ...glassMorphism(0.05),
            },
          }}
        >
          <ChatSidebar />
        </Drawer>
      ) : (
        <Box sx={{ width: 320, flexShrink: 0 }}>
          <ChatSidebar />
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <ChatContent />
      </Box>
    </ChatContainer>
  );
};

export default Chat;