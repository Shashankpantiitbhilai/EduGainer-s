import React, { useState, useEffect, useContext, useRef } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Send as SendIcon,
  Announcement,
  Person,
  Close,
} from "@mui/icons-material";
import io from "socket.io-client";
import { lightTheme } from "../../theme";
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
  const [unreadCounts, setUnreadCounts] = useState({
    announcements: 0,
    admin: 0,
  });
  const [showChatDialog, setShowChatDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

    if (IsUserLoggedIn) {
      fetchAdminAndMessages();
    }
  }, [IsUserLoggedIn]);

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
      const response = await fetchAllChats(id);
      const roomId = id;

      if (id === adminRoomId) {
        setAnnouncementMessages(response);
        setUnreadCounts((prev) => ({ ...prev, announcements: 0 }));
      } else {
        setMessages(response);
        setUnreadCounts((prev) => ({ ...prev, admin: 0 }));
      }
      setSelectedRoom(id);
      if (socketRef.current) {
        socketRef.current.emit("joinRoom", roomId);
      }
      scrollToBottom();
      setShowChatDialog(true);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleCloseChat = () => {
    setShowChatDialog(false);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        <Grid container spacing={2} sx={{ height: "100%" }}>
          {!isMobile && (
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
                  src="../../images/logo.jpg"
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
                          ? "warning.main"
                          : "transparent",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "warning.light",
                      },
                    }}
                    disabled={!IsUserLoggedIn}
                  >
                    <Badge
                      badgeContent={unreadCounts.announcements}
                      color="error"
                    >
                      <Announcement sx={{ mr: 1, color: "white" }} />
                    </Badge>
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
                          ? "warning.main"
                          : "transparent",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "warning.light",
                      },
                    }}
                    disabled={!IsUserLoggedIn}
                  >
                    <Badge badgeContent={unreadCounts.admin} color="error">
                      <Person sx={{ mr: 1, color: "white" }} />
                    </Badge>
                    <ListItemText primary="Admin" sx={{ color: "white" }} />
                  </ListItem>
                </List>{" "}
                <Typography
                  variant="body2"
                  sx={{ color: "white", mb: 2,mt:7, textAlign: "center" }}
                >
                  End-to-end encrypted.
                  <br /> Query your queries with our experts and get solutions
                  fast.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", mb: 2, textAlign: "center" }}
                >
                  Secure. Fast. Reliable. Your queries are our priority.
                </Typography>
              </Paper>
            </Grid>
          )}
          {isMobile ? (
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  height: "calc(100vh - 32px)",
                  p: 2,
                  backgroundColor: "primary.main",
                  overflowY: "auto",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "white", mb: 2, textAlign: "center" }}
                >
                  Edugainer Query Portal
                  {!IsUserLoggedIn && (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 4,
                        backgroundColor: "background.default",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: "error.main", textAlign: "center" }}
                      >
                        Please{" "}
                        <Link to="/login" style={{ color: "error.main" }}>
                          log in
                        </Link>{" "}
                        to access the Query portal.
                      </Typography>
                    </Box>
                  )}
                </Typography>
                <Avatar
                  alt="Admin"
                  src="../../images/logo.jpg"
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
                          ? "warning.main"
                          : "transparent",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "warning.light",
                      },
                    }}
                    disabled={!IsUserLoggedIn}
                  >
                    <Badge
                      badgeContent={unreadCounts.announcements}
                      color="error"
                    >
                      <Announcement sx={{ mr: 1, color: "white" }} />
                    </Badge>
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
                          ? "warning.main"
                          : "transparent",
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "warning.light",
                      },
                    }}
                    disabled={!IsUserLoggedIn}
                  >
                    <Badge badgeContent={unreadCounts.admin} color="error">
                      <Person sx={{ mr: 1, color: "white" }} />
                    </Badge>
                    <ListItemText primary="Admin" sx={{ color: "white" }} />
                  </ListItem>
                </List>{" "}
                <Typography
                  variant="body2"
                  sx={{ color: "white", mb: 2, mt: 7, textAlign: "center" }}
                >
                  End-to-end encrypted.
                  <br /> Query your queries with our experts and get solutions
                  fast.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "white", mb: 2, textAlign: "center" }}
                >
                  Secure. Fast. Reliable. Your queries are our priority.
                </Typography>
              </Paper>
              <Dialog
                open={showChatDialog}
                onClose={handleCloseChat}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">Chat</Typography>
                    <IconButton onClick={handleCloseChat}>
                      <Close />
                    </IconButton>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <Box
                    sx={{
                      height: "60vh",
                      overflowY: "auto",
                      p: 2,
                    }}
                  >
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
                          <Typography
                            variant="body1"
                            sx={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
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
                </DialogContent>
                <DialogActions>
                  {selectedRoom === adminRoomId &&
                  adminRoomId !== userRoomId ? (
                    <Typography color="error">
                      You are not authorized to send messages in the
                      announcement room.
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
                              sendMessage();
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
                </DialogActions>
              </Dialog>
            </Grid>
          ) : (
            <Grid item xs={12} sm={9}>
              {IsUserLoggedIn ? (
                <Paper
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
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
                          <Typography
                            variant="body1"
                            sx={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                          >
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
                    {selectedRoom === adminRoomId &&
                    adminRoomId !== userRoomId ? (
                      <Typography color="error">
                        You are not authorized to send messages in the
                        announcement room.
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
                                sendMessage();
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
              ) : (
                <Paper
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 4,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: "red" }}>
                    Please{" "}
                    <Link to="/login" style={{ color: "red" }}>
                      Login
                    </Link>{" "}
                    to access the Query portal.
                  </Typography>
                </Paper>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
