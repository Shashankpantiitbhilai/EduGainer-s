import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Paper,
  Grid,
  Divider,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Fab,
  Badge,
} from "@mui/material";
import {ThemeProvider} from "@mui/material";
import theme from "../../../theme";
import { Send as SendIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import io from "socket.io-client";
import { motion } from "framer-motion";

import { AdminContext } from "../../../App";
import {
  postChatMessages,
  fetchAdminCredentials,
} from "../../../services/chat/utils";
import {
  fetchAllChats,
  fetchAllSiteUsers,
} from "../../../services/Admin_services/adminUtils";

const ChatSection = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#121212",
  backgroundSize: "cover",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
}));
console.log(theme.palette.primary.main)
const Sidebar = styled(Grid)(({ theme }) => ({
  borderRight: "1px solid #e0e0e0",
  backgroundColor: "green",
  color: "white",
  [theme.breakpoints.down("sm")]: {
    borderRight: "none",
    borderBottom: "3px solid #e0e0e0",
  },
}));

const MessageArea = styled(List)(({ theme }) => ({
  height: "70vh",
  overflowY: "auto",
  flexGrow: 1,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: theme.spacing(2),
}));

const InputArea = styled(Grid)(({ theme }) => ({
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "white",
}));

const MessageItem = styled(motion.div)(({ theme, align }) => ({
  backgroundColor: theme.palette.secondary.main,
  marginBottom: theme.spacing(1),
  borderRadius: "10px",
  maxWidth: "70%",
  alignSelf: align === "right" ? "flex-end" : "flex-start",
  marginLeft: align === "right" ? "auto" : 0,
  marginRight: align === "right" ? 0 : "auto",
  whiteSpace: "pre-wrap",
  padding: theme.spacing(1),
  wordWrap: "break-word",
}));

const HeaderMessage = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  textAlign: "center",
  fontWeight: "bold",
  color: "white",
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const AdminChat = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminRoomId, setAdminRoomId] = useState("");
  const [users, setUsers] = useState([]);
  const socketRef = useRef();
  const messageEndRef = useRef(null);

  const [userRoomId, setUserRoomId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const [announcementMessages, setAnnouncementMessages] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [adminData, usersData] = await Promise.all([
          fetchAdminCredentials(),
          fetchAllSiteUsers(),
        ]);

        if (usersData) {
          setUsers(usersData);
        }

        if (adminData) {
          const admin = adminData;
          setAdminRoomId(adminData._id);

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

          const admin_id = admin._id;
          const user_id = IsUserLoggedIn._id;
          socketRef.current = socket;

          socket.on("receiveMessage", (message, roomId) => {
            if (roomId === admin_id) {
              setAnnouncementMessages((prevMessages) => [
                ...prevMessages,
                message,
              ]);
            } else {
              setMessages((prevMessages) => [...prevMessages, message]);
            }
            playBeep();
          });
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, announcementMessages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick = async (id) => {
    try {
      setSelectedRoom(id);
      const response = await fetchAllChats(id);
      const roomId = id;
      if (id === adminRoomId) {
        setAnnouncementMessages(response);
      } else {
        setMessages(response);
      }

      if (socketRef.current) {
        socketRef.current.emit("joinRoom", roomId);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const sendMessage = async (id) => {
    const messageData = {
      messages: [
        {
          sender: IsUserLoggedIn._id,
          receiver: "All",
          content: input,
        },
      ],
      user: id,
      timestamp: new Date(),
    };

    try {
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", messageData, selectedRoom);
      }
      setInput("");
      await postChatMessages(messageData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const playBeep = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, context.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0.3, context.currentTime);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);

    setTimeout(() => {
      context.close();
    }, 300);
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatSection>
        <Grid container component={ChatSection}>
          <Grid item xs={12}>
            <HeaderMessage variant="h5">Admin Query Portal</HeaderMessage>
          </Grid>
          <Grid item xs={12} sm={8} container direction="column">
            <MessageArea>
              {(adminRoomId === selectedRoom
                ? announcementMessages
                : messages
              ).map((msg, index) => (
                <MessageItem
                  key={index}
                  align={
                    msg.messages[0].sender === IsUserLoggedIn._id
                      ? "right"
                      : "left"
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        primary={msg.messages[0].content}
                        align={
                          msg.messages[0].sender === IsUserLoggedIn._id
                            ? "right"
                            : "left"
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        secondary={new Date(msg.timestamp).toLocaleTimeString()}
                        align={
                          msg.messages[0].sender === IsUserLoggedIn._id
                            ? "right"
                            : "left"
                        }
                      />
                    </Grid>
                  </Grid>
                </MessageItem>
              ))}
              <div ref={messageEndRef} />
            </MessageArea>
            <Divider />
            <InputArea container>
              <Grid item xs={11}>
                <TextField
                  id="outlined-basic-email"
                  label="Type Something"
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage(selectedRoom);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={1} align="right">
                <Fab
                  color="primary"
                  aria-label="send"
                  onClick={() => sendMessage(selectedRoom)}
                  disabled={!input.trim()}
                >
                  <SendIcon />
                </Fab>
              </Grid>
            </InputArea>
          </Grid>
          <Sidebar item xs={12} sm={4}>
            <List>
              <ListItem button onClick={() => handleClick(adminRoomId)}>
                <ListItemText primary="Announcement Room" />
              </ListItem>
              <Divider />
              {users.map(
                (user) =>
                  IsUserLoggedIn._id !== user._id && (
                    <ListItem
                      button
                      key={user._id}
                      onClick={() => handleClick(user._id)}
                    >
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                      >
                        <Avatar alt={user.name} src={user.avatarUrl} />
                      </StyledBadge>
                      <ListItemText
                        primary={user.username}
                        style={{ marginLeft: "10px" }}
                      />
                    </ListItem>
                  )
              )}
            </List>
          </Sidebar>
        </Grid>
      </ChatSection>{" "}
    </ThemeProvider>
  );
};

export default AdminChat;
