// NotificationDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Stack,
  Badge,
  Box,
} from "@mui/material";
import { Chat as ChatIcon, Close as CloseIcon, Mail as MailIcon } from "@mui/icons-material";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NotificationDialog = ({ open, onClose, unseenMessageCount, onViewMessages }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="notification-dialog"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#1976d2", color: "white" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <MailIcon />
          <Typography variant="h6">New Messages</Typography>
        </Stack>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ py: 2, textAlign: "center" }}>
          <Badge badgeContent={unseenMessageCount} color="error" sx={{ mb: 2 }}>
            <ChatIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          </Badge>
          <Typography variant="h6" gutterBottom>
            You have {unseenMessageCount} new message{unseenMessageCount !== 1 ? "s" : ""}!
          </Typography>
          <Typography color="text.secondary">
            Click below to view your messages in the chat section.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Dismiss
        </Button>
        <Button onClick={onViewMessages} variant="contained" startIcon={<ChatIcon />}>
          View Messages
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationDialog;
