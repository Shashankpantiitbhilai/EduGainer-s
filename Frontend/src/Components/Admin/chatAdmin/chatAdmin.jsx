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
  fetchAllUsers,
} from "../../../services/Admin_services/adminUtils";

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
}));

const InputArea = styled(Grid)(({ theme }) => ({
  padding: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const AdminChat = ({  }) => {
  const { IsUserLoggedIn } = useContext(AdminContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [adminRoomId, setAdminRoomId] = useState("");
  const [users, setUsers] = useState([]);
  const socketRef = useRef();
   const [roomId, setRoomId] = useState("");
 const [chatId, setChatId] = useState("");
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [adminData, usersData] = await Promise.all([
          fetchAdminCredentials(),
          fetchAllUsers(),
        ]);

        if (usersData) {
          setUsers(usersData);
        }

        if (adminData) {
          const admin = adminData;
          setAdminRoomId(adminData._id)
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

  socket.on("xyz", (message, roomId) => {
    console.log("received message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  });
         
          return () => {
      
            socket.disconnect();
          };
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleClick = async (id) => {
    try {
      const response = await fetchAllChats(id);
      const roomId = id;
      setAdminRoomId(roomId);
      setMessages(response);
      setChatId(id);
      setRoomId(id)
      if (socketRef.current) {
        console.log("emitted joinroom",roomId);
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
          receiver: id,
          content: input,
        },
      ],
      user: id,
      timestamp: new Date(),
    };

    try {
      const response = await postChatMessages(messageData);
      
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", messageData,roomId);
      }
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <HeaderMessage variant="h5">Edugainer Chat</HeaderMessage>
        </Grid>
      </Grid>
      <Grid container component={ChatSection}>
        <Sidebar item xs={12} sm={4}>
          <List>
            {users.map(
              (user) =>
                IsUserLoggedIn._id !== user._id && (
                  <ListItem
                    button
                    key={user._id}
                    onClick={() => handleClick(user._id)}
                  >
                    <Avatar alt={user.username} src={user.avatar} />
                    <ListItemText
                      primary={user.username}
                      style={{ color: "white" }}
                    />
                  </ListItem>
                )
            )}
          </List>
        </Sidebar>
        <Grid item xs={12} sm={8} container direction="column">
          <MessageArea>
            {messages.map((msg, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align={
                        msg.messages[0].sender === IsUserLoggedIn._id
                          ? "right"
                          : "left"
                      }
                      primary={msg.messages[0].content}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align={
                        msg.messages[0].sender === IsUserLoggedIn._id
                          ? "right"
                          : "left"
                      }
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
                onClick={()=>sendMessage(chatId)}
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

export default AdminChat;
