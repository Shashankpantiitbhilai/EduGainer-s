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
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@mui/material";
import theme from "../../../theme";
import {
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

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
  overflowWrap: "break-word",
}));

const HeaderMessage = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  textAlign: "center",
  fontWeight: "bold",
  color: "white",
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "orange",
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

const SidebarItem = styled(ListItem)(({ theme, selected }) => ({
  "&:hover": {
    backgroundColor: "orange",
  },
  backgroundColor: selected ? "orange" : "transparent",
  color: selected ? "orange" : "inherit",
  transition: "background-color 0.3s ease",
}));

const UnreadBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
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

  const [selectedRoom, setSelectedRoom] = useState("");
  const [announcementMessages, setAnnouncementMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
 const [sender, setsender] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [adminData, usersData] = await Promise.all([
          fetchAdminCredentials(),
          fetchAllSiteUsers(),
        ]);

        if (usersData) {
          setUsers(usersData);
          const initialUnreadCounts = {};
          usersData.forEach((user) => {
            initialUnreadCounts[user._id] = 0;
          });
          setUnreadCounts(initialUnreadCounts);
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
          socketRef.current = socket;

          socket.on("receiveMessage", (message, roomId, sender) => {
           
            if (sender === selectedRoom) {
              if (roomId === admin_id) {
                setAnnouncementMessages((prevMessages) => [
                  ...prevMessages,
                  message,
                ]);
              } else {
                setMessages((prevMessages) => [...prevMessages, message]);
             
               
              }
            }
             if (roomId !== selectedRoom && sender !== admin_id) {
               setUnreadCounts((prev) => ({
                 ...prev,
                 [roomId]: (prev[roomId] || 0) + 1,
               }));
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

 

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageData = {
      messages: [
        {
          sender: IsUserLoggedIn._id,
          receiver: "All",
          content: input,
        },
      ],
      user: selectedRoom,
      timestamp: new Date(),
    };

    try {
      if (socketRef.current) {
        socketRef.current.emit(
          "sendMessage",
          messageData,
          selectedRoom,
          adminRoomId
        );
      }
      setInput("");
      await postChatMessages(messageData);
        if (selectedRoom === adminRoomId ) {
          setAnnouncementMessages((prevMessages) => [...prevMessages, messageData]);
        } else {
          setMessages((prevMessages) => [...prevMessages, messageData]);
        }
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

  const handleClick = async (id) => {
    try {
      setSelectedRoom(id);
      const response = await fetchAllChats(id);
      if (id === adminRoomId) {
        setAnnouncementMessages(response);
      } else {
        setMessages(response);
      }

      setUnreadCounts((prev) => ({
        ...prev,
        [id]: 0,
      }));

      if (socketRef.current) {
        socketRef.current.emit("joinRoom", id);
      }

      if (isMobile) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const getSelectedUserName = () => {
    if (selectedRoom === adminRoomId) return "Announcement Room";
    const selectedUser = users.find((user) => user._id === selectedRoom);
    return selectedUser ? selectedUser.username : "";
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatSection>
        <Grid container component={ChatSection}>
          <Grid item xs={12}>
            <HeaderMessage variant="h5">Admin Query Portal</HeaderMessage>
          </Grid>
          {(!isMobile || (isMobile && showSidebar)) && (
            <Sidebar
              item
              xs={12}
              sm={4}
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <List>
                <SidebarItem
                  button
                  onClick={() => handleClick(adminRoomId)}
                  selected={selectedRoom === adminRoomId}
                >
                  <ListItemText primary="Announcement Room" />
                </SidebarItem>
                <Divider />
                {users.map(
                  (user) =>
                    IsUserLoggedIn._id !== user._id && (
                      <SidebarItem
                        button
                        key={user._id}
                        onClick={() => handleClick(user._id)}
                        selected={selectedRoom === user._id}
                      >
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <Avatar alt={user.firstName} src={user.avatarUrl} />
                        </StyledBadge>
                        <ListItemText
                          primary={user.username}
                          style={{ marginLeft: "10px" }}
                        />
                        <UnreadBadge
                          badgeContent={unreadCounts[user._id]}
                          color="error"
                        />
                      </SidebarItem>
                    )
                )}
              </List>
            </Sidebar>
          )}
          {(!isMobile || (isMobile && !showSidebar)) && (
            <Grid item xs={12} sm={8} container direction="column">
              {isMobile && (
                <Grid item xs={12}>
                  <Fab
                    color="primary"
                    aria-label="back"
                    onClick={() => setShowSidebar(true)}
                    style={{ margin: "10px" }}
                  >
                    <ArrowBackIcon />
                  </Fab>
                  <Typography
                    variant="h6"
                    style={{ display: "inline-block", marginLeft: "10px" }}
                  >
                    {getSelectedUserName()}
                  </Typography>
                </Grid>
              )}

             
                <MessageArea>
                 
                  <AnimatePresence>
                    {(adminRoomId === selectedRoom
                      ? announcementMessages
                      : messages
                    ).map((msg, index) => (
                      <MessageItem
                        key={index}
                        sx={{
                          p: 1,
                          backgroundColor:
                            msg.messages[0].sender === IsUserLoggedIn._id
                              ? "secondary.light"
                              : "primary.light",
                          borderRadius: 2,
                          maxWidth: "70%",
                        }}
                        align={
                          msg.messages[0].sender === IsUserLoggedIn._id
                            ? "right"
                            : "left"
                        }
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Grid container>
                          <Grid item xs={12}>
                            <ListItemText
                              primary={msg.messages[0].content}
                              primaryTypographyProps={{
                                style: { wordBreak: "break-word" },
                              }}
                              align={
                                msg.messages[0].sender === IsUserLoggedIn._id
                                  ? "right"
                                  : "left"
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <ListItemText
                              secondary={new Date(
                                msg.timestamp
                              ).toLocaleTimeString()}
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
                  </AnimatePresence>
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
                        sendMessage();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={1} align="right">
                  <Fab
                    color="primary"
                    aria-label="send"
                    onClick={sendMessage}
                    disabled={!input.trim()}
                  >
                    <SendIcon />
                  </Fab>
                </Grid>
              </InputArea>
            </Grid>
          )}
        </Grid>
      </ChatSection>
    </ThemeProvider>
  );
};

export default AdminChat;
