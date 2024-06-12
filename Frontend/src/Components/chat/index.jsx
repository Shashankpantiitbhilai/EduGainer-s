import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000"); // Update with your backend URL

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sender, setSender] = useState("student"); // or 'admin'
  const [receiver, setReceiver] = useState("admin"); // or 'student'

  useEffect(() => {
    axios
      .get("http://localhost:8000/messages")
      .then((response) => setMessages(response.data));

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const sendMessage = () => {
    const message = { sender, receiver, message: input };
    axios.post("http://localhost:8000/messages", message);
    socket.emit("sendMessage", message);
    setInput("");
    console.log(message);
  };

  return (
    <div>
      <h1>Edugainer Chat Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
