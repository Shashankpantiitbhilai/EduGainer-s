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

import { AdminContext } from "../../App";
import {
  fetchChatMessages,
  postChatMessages,
  fetchAdminCredentials,
} from "../../services/chat/utils";

// Import the background image
import backgroundImage from "../../images/backgroundChat.jpg";

const ChatSection = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fff",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  opacity: 0.9,
}));

const HeaderMessage = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  textAlign: "center",
  fontWeight: "bold",
  color: "#004d40",
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
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  opacity: 0.9,
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
  const [adminRoomId, setAdminRoomId] = useState("");
  const socketRef = useRef(null);
  const [roomId, setRoomId] = useState("");

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
          const userid = IsUserLoggedIn._id;
          const adminid = admin._id;
          const roomId = userid;
          setAdminRoomId(adminid);
          setRoomId(roomId);

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

          socket.emit("joinRoom", roomId);

          // Setting up the listener
          socket.on("xyz", (message, roomId) => {
            console.log("received message", message);
            setMessages((prevMessages) => [...prevMessages, message]);
          });

          // Clean up the socket connection when the component unmounts
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
        socketRef.current.emit("sendMessage", messageData, roomId);
      }

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Grid container spacing={2} component={ChatSection}>
      <Grid item xs={12}>
        <HeaderMessage variant="h5">Edugainer Query Portal</HeaderMessage>
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
            key="admin"
            onClick={() => socketRef.current.emit("joinRoom", adminRoomId)}
          >
            <ListItemText primary="Admin" />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={9} container direction="column">
        <MessageArea>
          {messages.map((msg, index) => (
            <MessageItem
              key={index}
              align={
                msg.messages[0].sender === IsUserLoggedIn._id ? "right" : "left"
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
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              <SendIcon />
            </Fab>
          </Grid>
        </InputArea>
      </Grid>
    </Grid>
  );
};

export default Chat;
