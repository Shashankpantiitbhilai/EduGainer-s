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
  InputAdornment,
} from "@mui/material";
import {
  Send as SendIcon,
  Announcement,
  Person,
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
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
import ChatInput from "./chatInput"
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
    <Box
      sx={{
        width: isMobile ? 240 : "100%",
        height: "100%",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Avatar
          alt="Edugainer"
          src="../../images/logo.jpg"
          sx={{ 
            width: 64, 
            height: 64, 
            mx: "auto", 
            mb: 1,
            border: 2,
            borderColor: "primary.main" 
          }}
        />
        <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
          Query Portal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Connect with our experts
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ p: 2 }}>
        <ListItem
          button
          onClick={() => handleRoomClick(adminRoomId)}
          sx={{
            mb: 1,
            borderRadius: 2,
            bgcolor: selectedRoom === adminRoomId ? "primary.light" : "transparent",
            "&:hover": { bgcolor: "primary.lighter" },
          }}
        >
          <Badge badgeContent={unreadCounts.announcements} color="error">
            <Announcement sx={{ mr: 2, color: "primary.main" }} />
          </Badge>
          <ListItemText 
            primary="Announcements"
            secondary={`${announcementMessages.length} messages`}
          />
        </ListItem>
        
        <ListItem
          button
          onClick={() => handleRoomClick(userRoomId)}
          sx={{
            borderRadius: 2,
            bgcolor: selectedRoom === userRoomId ? "primary.light" : "transparent",
            "&:hover": { bgcolor: "primary.lighter" },
          }}
        >
          <Badge badgeContent={unreadCounts.admin} color="error">
            <Person sx={{ mr: 2, color: "primary.main" }} />
          </Badge>
          <ListItemText 
            primary="Admin Chat"
            secondary={`${messages.length} messages`}
          />
        </ListItem>
      </List>
      
      <Box sx={{ p: 2, mt: "auto" }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          End-to-end encrypted
        </Typography>
      </Box>
    </Box>
  );

  const ChatContent = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <AppBar 
        position="static" 
        color="inherit" 
        elevation={0}
        sx={{ 
          borderBottom: 1, 
          borderColor: "divider",
          bgcolor: "background.paper" 
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              {drawerOpen ? <ArrowBackIcon /> : <MenuIcon />}
            </IconButton>
          )}
          <Typography variant="h6" color="primary">
            {selectedRoom === adminRoomId ? "Announcements" : "Admin Chat"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {(selectedRoom === adminRoomId ? announcementMessages : messages).map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: msg.messages[0].sender === IsUserLoggedIn._id ? "flex-end" : "flex-start",
              mb: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                maxWidth: "70%",
                bgcolor: msg.messages[0].sender === IsUserLoggedIn._id 
                  ? "primary.light" 
                  : "background.paper",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="body1">
                {msg.messages[0].content}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {selectedRoom !== adminRoomId || adminRoomId === userRoomId ? (
        <Box sx={{ p: 2, bgcolor: "background.paper", borderTop: 1, borderColor: "divider" }}>
      
<ChatInput 
  onSendMessage={(message) => {
    setInput(message);
    sendMessage(message);
  }}
  isRoomSelected={isRoomSelected}
/>
        </Box>
      ) : (
        <Box sx={{ p: 2, bgcolor: "background.paper", borderTop: 1, borderColor: "divider" }}>
          <Typography color="error" align="center">
            You cannot send messages in the announcement room
          </Typography>
        </Box>
      )}
    </Box>
  );

  if (!IsUserLoggedIn) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default"
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 400,
            mx: 2
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Welcome to Query Portal
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please log in to access the chat features
          </Typography>
          <Link 
            to="/login"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
              fontWeight: "bold"
            }}
          >
            Login Now
          </Link>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: 240 },
          }}
        >
          <ChatSidebar />
        </Drawer>
      ) : (
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <ChatSidebar />
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <ChatContent />
      </Box>
    </Box>
  );
};

export default Chat;