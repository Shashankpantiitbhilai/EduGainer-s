import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";

const MultiplePersonsDialog = ({ open, onClose, seatInfo, onPersonClick }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Seat Occupants</DialogTitle>
    <DialogContent>
      <List>
        {seatInfo &&
          seatInfo.map((person) => (
            <ListItem
              key={person._id}
              button
              onClick={() => onPersonClick(person.reg)}
            >
              <ListItemAvatar>
                <Avatar>{person.avatar}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={person.name}
                secondary={`Seat: ${person.seat}, Shift: ${person.shift}, Reg: ${person.reg}`}
              />
            </ListItem>
          ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={() => {
          seatInfo.forEach((person) => {
            person.name = "";
            person.seat = "";
            person.shift = "";
            person.reg = "";
            person.avatar = "";
          });
          onClose();
        }}
        color="inherit"
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default MultiplePersonsDialog;
