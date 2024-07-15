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
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import io from "socket.io-client";

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
}));

const Sidebar = styled(Grid)(({ theme }) => ({
  borderRight: "1px solid #e0e0e0",
  backgroundColor: "#004d40",
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
}));

const InputArea = styled(Grid)(({ theme }) => ({
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "white",
}));

const MessageItem = styled(ListItem)(({ theme, align }) => ({
  backgroundColor: "#ffeb3b",
  marginBottom: theme.spacing(1),
  borderRadius: "10px",
  maxWidth: "40%",
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

const AdminChat = () => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminRoomId, setAdminRoomId] = useState("");
  const [users, setUsers] = useState([]);
  const socketRef = useRef();

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
              console.log("received message ", message);
              setAnnouncementMessages((prevMessages) => [
                ...prevMessages,
                message,
              ]);
            } else {
              setMessages((prevMessages) => [...prevMessages, message]);
            }
            // Play the beep sound
            playBeep();
          });
          console.log(messages);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleClick = async (id) => {
    try {
      setSelectedRoom(id);
      const response = await fetchAllChats(id);
      const roomId = id;
      console.log(id, userRoomId, adminRoomId, selectedRoom);
      if (id === adminRoomId) {
        setAnnouncementMessages(response);
      } else {
        setMessages(response);
      }

      if (socketRef.current) {
        console.log("emitted joinroom", roomId);
        socketRef.current.emit("joinRoom", roomId);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
    console.log(announcementMessages.length);
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
      console.log(id);
      await postChatMessages(messageData);

      if (socketRef.current) {
        socketRef.current.emit("sendMessage", messageData, selectedRoom);
      }
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const playBeep = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(1000, context.currentTime); // frequency in Hz
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Adjusting gain (volume) to make it a gentle reminder
    gainNode.gain.setValueAtTime(0.3, context.currentTime);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.3); // beep duration in seconds (0.3 seconds)

    setTimeout(() => {
      context.close(); // Closing the audio context after the sound is played
    }, 300); // Close the context after 300ms (same as the beep duration)
  };

  return (
    <Grid container component={ChatSection}>
      <Grid item xs={12}>
        <HeaderMessage variant="h5">Admin Query Portal</HeaderMessage>
      </Grid>
      <Grid item xs={12} sm={8} container direction="column">
        <MessageArea>
          {adminRoomId === selectedRoom &&
            announcementMessages.map((msg, index) => (
              <MessageItem
                key={index}
                align={
                  msg.messages[0].sender === IsUserLoggedIn._id
                    ? "right"
                    : "left"
                }
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

          {adminRoomId !== selectedRoom &&
            messages.map((msg, index) => (
              <MessageItem
                key={index}
                align={
                  msg.messages[0].sender === IsUserLoggedIn._id
                    ? "right"
                    : "left"
                }
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
                  <Avatar alt={user.name} src={user.avatarUrl} />
                  <ListItemText primary={user.username} />
                </ListItem>
              )
          )}
        </List>
      </Sidebar>
    </Grid>
  );
};

export default AdminChat;
