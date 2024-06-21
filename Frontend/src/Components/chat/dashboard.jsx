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
  Alert,
  Stack,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import io from "socket.io-client";

import { AdminContext } from "../../App";
import {
  fetchChatMessages,
  postChatMessages,
  fetchAdminCredentials,
} from "../../services/chat/utils";

// import backgroundImage from "../../images/backgroundChat.jpg";
import { fetchAllChats } from "../../services/Admin_services/adminUtils";

const ChatSection = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#121212",
  // backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  
}));

const HeaderMessage = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  textAlign: "center",
  fontWeight: "bold",
  color: "white",
}));

const Sidebar = styled(Grid)(({ theme }) => ({
  borderRight: "1px solid #e0e0e0",
  backgroundColor: "#004d40",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    borderRight: "none",
    borderBottom: "1px solid #e0e0e0",
  },
}));

const MessageArea = styled(List)(({ theme }) => ({
  height: "70vh",
  overflowY: "auto",
  flexGrow: 1,
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: theme.spacing(2),
  // backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  opacity: 4.0,
}));

const InputArea = styled(Grid)(({ theme }) => ({
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const MessageItem = styled(ListItem)(({ theme, align }) => ({
  backgroundColor: "#ffeb3b",
  marginBottom: theme.spacing(1),
  borderRadius: "10px",
  maxWidth: "60%",
  alignSelf: align === "right" ? "flex-end" : "flex-start",
  marginLeft: align === "right" ? "auto" : 0,
  marginRight: align === "right" ? 0 : "auto",
  whiteSpace: "pre-wrap",
  padding: theme.spacing(1),
  wordWrap: "break-word",
}));



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
          console.log(adminRoomId)
          setUserRoomId(user_id);

          const url =
            process.env.NODE_ENV === "production"
              ? "https://edu-gainer-s-backend.vercel.app"
              : "http://localhost:8000";
          const socket = io(url, {
            query: {
              sender: IsUserLoggedIn._id,
              admin: admin._id,
            },
          });

          socketRef.current = socket;

          socket.on("receiveMessage", (message, roomId) => {
            console.log("received message",message)
            if (roomId === admin_id) {
               console.log("received message announcement", message);
              setAnnouncementMessages((prevMessages) => [
                ...prevMessages,
                message,
              ]);
            } else {
              setMessages((prevMessages) => [...prevMessages, message]);
            }
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

  const sendMessage = async () => {
    if (selectedRoom === adminRoomId && adminRoomId !== userRoomId) {
      setError("You are not authorized to send messages in the announcement room.");
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
        const response = await postChatMessages(messageData);
        if (socketRef.current) {
          socketRef.current.emit("sendMessage", messageData, selectedRoom);
        }

        setInput("");
        setError(""); // Clear error message after a successful send
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

 const handleRoomClick = async (id) => {
   try {
     const response = await fetchAllChats(id);
     const roomId = id;
     console.log(id);
     if (id === adminRoomId) {
       setAnnouncementMessages(response);
       console.log("announcment", response, announcementMessages);
     } else {
       setMessages(response);
     }
     setSelectedRoom(id);
     if (socketRef.current) {
       console.log("emitted joinroom", roomId);
       socketRef.current.emit("joinRoom", roomId);
     }
   } catch (error) {
     console.error("Error fetching chat messages:", error);
   }
 };
  return (
    <Grid container spacing={2} component={ChatSection}>
      <Grid item xs={12}>
        <HeaderMessage variant="h5" >Edugainer Query Portal</HeaderMessage>
      </Grid>
      <Grid item xs={12} sm={3} component={Sidebar}>
        <Avatar
          alt="Admin"
          src="https://material-ui.com/static/images/avatar/1.jpg"
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <List>
          <ListItem
            button
            key="announcement"
            onClick={() => handleRoomClick(adminRoomId)}
          >
            <ListItemText primary="Announcements" />
          </ListItem>
          <ListItem
            button
            key="admin"
            onClick={() => handleRoomClick(userRoomId)}
          >
            <ListItemText primary="Admin" />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={9} container direction="column">
        <MessageArea>
          {selectedRoom === adminRoomId
            ? announcementMessages.map((msg, index) => (
                <MessageItem key={index} align="left">
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText primary={msg.messages[0].content} />
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        secondary={new Date(msg.timestamp).toLocaleTimeString()}
                      />
                    </Grid>
                  </Grid>
                </MessageItem>
              ))
            : messages.map((msg, index) => (
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
                      <ListItemText primary={msg.messages[0].content} />
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        secondary={new Date(msg.timestamp).toLocaleTimeString()}
                      />
                    </Grid>
                  </Grid>
                </MessageItem>
              ))}
        </MessageArea>
        <Divider />
        {selectedRoom === adminRoomId && adminRoomId !== userRoomId ? (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert variant="outlined" severity="warning">
              You are not authorized to send messages in the announcement room.
            </Alert>
          </Stack>
        ) : (
          <InputArea container>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                error={!!error}
                helperText={error}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={sendMessage}>
                <SendIcon />
              </Fab>
            </Grid>
          </InputArea>
        )}
      </Grid>
    </Grid>
  );
};

export default Chat;
