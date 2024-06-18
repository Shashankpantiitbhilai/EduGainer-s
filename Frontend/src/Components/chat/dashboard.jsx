import React, { useState, useEffect, useContext } from "react";
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

const ChatSection = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
}));

const HeaderMessage = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Sidebar = styled(Grid)(({ theme }) => ({
  borderRight: "1px solid #e0e0e0",
  [theme.breakpoints.down("sm")]: {
    borderRight: "none",
    borderBottom: "1px solid #e0e0e0",
  },
}));

const MessageArea = styled(List)(({ theme }) => ({
  height: "70vh",
  overflowY: "auto",
  flexGrow: 1,
}));

const InputArea = styled(Grid)(({ theme }) => ({
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Chat = ({ user }) => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminRoomId, setAdminRoomId] = useState(""); // State to hold admin room ID

  useEffect(() => {
    const socket = io("http://localhost:8000", {
      query: {
        sender: IsUserLoggedIn._id,
      },
    });
    const fetchData = async () => {
      try {
        const [chatData, adminData] = await Promise.all([
          fetchChatMessages(),
          fetchAdminCredentials(),
        ]);
        console.log(adminData);

        setMessages(chatData);
        setAdminRoomId(adminData._id);

        console.log("admin id", adminData._id, adminRoomId);
        socket.on("receiveMessage", (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
          socket.off("receiveMessage");
        };
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchData();
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
      console.log(response);
      const socket = io("http://localhost:8000");
      socket.emit("sendMessage", messageData);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAdminClick = () => {
    // Join the admin's room on socket
    const socket = io("http://localhost:8000");
    socket.emit("join", adminRoomId);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <HeaderMessage variant="h5">Edugainer Chat</HeaderMessage>
        </Grid>
      </Grid>
      <Grid container component={ChatSection}>
        <Sidebar item xs={12} sm={3}>
          <List>
            <ListItem button key="admin" onClick={handleAdminClick}>
              <Avatar
                alt="Admin"
                src="https://material-ui.com/static/images/avatar/1.jpg"
              />
              <ListItemText primary="Admin" />
            </ListItem>
          </List>
        </Sidebar>
        <Grid item xs={12} sm={9} container direction="column">
          <MessageArea>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align={msg.sender === user ? "right" : "left"}
                      primary={msg.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align={msg.sender === user ? "right" : "left"}
                      secondary={new Date(msg.timestamp).toLocaleTimeString()}
                    />
                  </Grid>
                </Grid>
              </ListItem>
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
    </div>
  );
};

export default Chat;
