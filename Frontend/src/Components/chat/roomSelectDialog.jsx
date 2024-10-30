// RoomSelectDialog.js
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import logo from "../../images/logo.jpg";

const RoomSelectDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box display="flex" justifyContent="center" alignItems="center" paddingY={2}>
        <img src={logo} alt="Logo" style={{ width: "80px", height: "auto", borderRadius: "8px" }} />
      </Box>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <ChatIcon color="primary" />
          <Typography variant="h6" component="span">
            Select a Chat Room
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          To start chatting, please select a chat room from the left side. Once a room is selected, you can begin your conversation by typing your message below.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Got It
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomSelectDialog;
