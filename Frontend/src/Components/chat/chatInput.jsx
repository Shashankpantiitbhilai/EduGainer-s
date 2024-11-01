import React, { useState, useRef } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

const ChatInput = ({ onSendMessage, isRoomSelected }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
      if (input.trim()) {
        console.log(input,"input in chtainput")
      onSendMessage(input);
      setInput("");
      // Keep focus on the input after sending
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      placeholder="Type your message..."
      value={input}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      autoFocus
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton 
              onClick={handleSendMessage}
              disabled={!input.trim() || !isRoomSelected}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
        sx: { 
          borderRadius: 3,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent"
          },
          bgcolor: "action.hover"
        }
      }}
    />
  );
};

export default ChatInput;