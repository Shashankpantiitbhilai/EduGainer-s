import React, { useState, useEffect, useContext, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";
import { Send as SendIcon, Announcement, Person } from "@mui/icons-material";
import io from "socket.io-client";
import theme from "../../theme";
import { AdminContext } from "../../App";
import {
  fetchChatMessages,
  postChatMessages,
  fetchAdminCredentials,
} from "../../services/chat/utils";
import { fetchAllChats } from "../../services/Admin_services/adminUtils";



const Chat = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [announcementMessages, setAnnouncementMessages] = useState([]);
  const [adminRoomId, setAdminRoomId] = useState("");
  const socketRef = useRef(null);
  const [userRoomId, setUserRoomId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

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
            scrollToBottom();
          });

          return () => {
            socket.disconnect();
          };
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchAdminAndMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, announcementMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
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
            content: input,
          },
        ],
        user: IsUserLoggedIn._id,
        timestamp: new Date(),
      };
      try {
        await postChatMessages(messageData);
        if (socketRef.current) {
          socketRef.current.emit("sendMessage", messageData, selectedRoom);
        }

        setInput("");
        setError("");
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
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

  const handleRoomClick = async (id) => {
    try {
      const response = await fetchAllChats(id);
      const roomId = id;

      if (id === adminRoomId) {
        setAnnouncementMessages(response);
      } else {
        setMessages(response);
      }
      setSelectedRoom(id);
      if (socketRef.current) {
        socketRef.current.emit("joinRoom", roomId);
      }
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
       
        }}
      >
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={12} sm={3}>
            <Paper
              elevation={3}
              sx={{
                height: "calc(100vh - 32px)",
                p: 2,
                backgroundColor: "primary.main",
                position: "sticky",
                top: 16,
                overflowY: "auto",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "white", mb: 2, textAlign: "center" }}
              >
                Edugainer Query Portal
              </Typography>
              <Avatar
                alt="Admin"
                src="https://material-ui.com/static/images/avatar/1.jpg"
                sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
              />
              <List>
                <ListItem
                  button
                  onClick={() => handleRoomClick(adminRoomId)}
                  sx={{
                    mb: 1,
                    backgroundColor:
                      selectedRoom === adminRoomId
                        ? "secondary.main"
                        : "transparent",
                    borderRadius: 1,
                  }}
                >
                  <Announcement sx={{ mr: 1, color: "white" }} />
                  <ListItemText
                    primary="Announcements"
                    sx={{ color: "white" }}
                  />
                </ListItem>
                <ListItem
                  button
                  onClick={() => handleRoomClick(userRoomId)}
                  sx={{
                    backgroundColor:
                      selectedRoom === userRoomId
                        ? "secondary.main"
                        : "transparent",
                    borderRadius: 1,
                  }}
                >
                  <Person sx={{ mr: 1, color: "white" }} />
                  <ListItemText primary="Admin" sx={{ color: "white" }} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Paper
              elevation={3}
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
                {(selectedRoom === adminRoomId
                  ? announcementMessages
                  : messages
                ).map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.messages[0].sender === IsUserLoggedIn._id
                          ? "flex-end"
                          : "flex-start",
                      mb: 2,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        backgroundColor:
                          msg.messages[0].sender === IsUserLoggedIn._id
                            ? "secondary.light"
                            : "primary.light",
                        borderRadius: 2,
                        maxWidth: "70%",
                      }}
                    >
                      <Typography variant="body1">
                        {msg.messages[0].content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          color: "text.secondary",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              <Box sx={{ p: 2, backgroundColor: "background.paper" }}>
                {selectedRoom === adminRoomId && adminRoomId !== userRoomId ? (
                  <Typography color="error">
                    You are not authorized to send messages in the announcement
                    room.
                  </Typography>
                ) : (
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
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
                    <Grid item>
                      <IconButton
                        color="primary"
                        onClick={sendMessage}
                        disabled={!input.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
