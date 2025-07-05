import React, { useState, useRef } from "react";
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Box, 
  useTheme,
  styled,
  alpha,
  Tooltip,
} from "@mui/material";
import { 
  Send as SendIcon, 
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";
import { designTokens, glassMorphism } from '../../theme/enterpriseTheme';

// Styled components for enterprise chat input
const ChatInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: designTokens.borderRadius.xl,
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.divider}`,
  ...glassMorphism(0.02),
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    transform: 'translateY(-2px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: designTokens.borderRadius.lg,
    backgroundColor: 'transparent',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 0),
    fontSize: designTokens.typography.fontSize.base,
    fontWeight: designTokens.typography.fontWeight.medium,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: designTokens.borderRadius.lg,
  padding: theme.spacing(1.5),
  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.default}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    transform: 'none',
  },
}));

const ChatInput = ({ onSendMessage, isRoomSelected }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const theme = useTheme();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() && isRoomSelected) {
      onSendMessage(input);
      setInput("");
      // Keep focus on the input after sending
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatInputContainer>
      <StyledTextField
        inputRef={inputRef}
        fullWidth
        multiline
        maxRows={4}
        placeholder={isRoomSelected 
          ? "Type your message..." 
          : "Select a conversation to start chatting"
        }
        value={input}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        autoFocus
        disabled={!isRoomSelected}
      />
      
      <Tooltip title="Send message" placement="top">
        <span>
          <SendButton 
            onClick={handleSendMessage}
            disabled={!input.trim() || !isRoomSelected}
            size="large"
          >
            <SendIcon />
          </SendButton>
        </span>
      </Tooltip>
    </ChatInputContainer>
  );
};

export default ChatInput;