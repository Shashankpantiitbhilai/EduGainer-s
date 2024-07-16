import React, { useState, useEffect } from "react";
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
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box,
  Fade,
  Grow,
} from "@mui/material";
import {
  RemoveCircle,
  Person,
  Event,
  AssignmentInd,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MultiplePersonsDialog = ({
  open,
  onClose,
  seatInfo,
  onPersonClick,
  onDeallocate,
}) => {
  const [persons, setPersons] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    person: null,
  });

  useEffect(() => {
    if (seatInfo) {
      setPersons(seatInfo);
    }
  }, [seatInfo]);

  const handleDeallocate = (person) => {
    setConfirmDialog({ open: true, person });
  };

  const handleConfirmDeallocate = async () => {
    try {
      await onDeallocate(confirmDialog.person.reg);
      setPersons((prevPersons) =>
        prevPersons.filter((p) => p._id !== confirmDialog.person._id)
      );
      setConfirmDialog({ open: false, person: null });
    } catch (error) {
      console.error("Error deallocating person:", error);
    }
  };

  const handleCancelDeallocate = () => {
    setConfirmDialog({ open: false, person: null });
  };

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#DFBF9A",
      "#B19CD9",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>
          <Typography variant="h5" component="div" fontWeight="bold">
            Seat Occupants
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {persons.map((person, index) => (
              <Grow
                in={true}
                key={person._id}
                style={{ transformOrigin: "0 0 0" }}
                timeout={(index + 1) * 200}
              >
                <ListItem
                  component={motion.div}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    "&:hover": { boxShadow: 3 },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getRandomColor(),
                        width: 56,
                        height: 56,
                        fontSize: "1.5rem",
                      }}
                    >
                      {person.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div">
                        {person.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          icon={<Person />}
                          label={`Seat: ${person.seat}`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          icon={<Event />}
                          label={`Shift: ${person.shift}`}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          icon={<AssignmentInd />}
                          label={`Reg: ${person.reg}`}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="deallocate"
                      onClick={() => handleDeallocate(person)}
                      sx={{
                        color: "error.main",
                        "&:hover": { bgcolor: "error.light" },
                      }}
                    >
                      <RemoveCircle />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Grow>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="primary"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancelDeallocate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deallocation"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="alert-dialog-description">
            Are you sure you want to deallocate{" "}
            <strong>{confirmDialog.person?.name}</strong> from seat{" "}
            <strong>{confirmDialog.person?.seat}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeallocate} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeallocate}
            color="error"
            variant="contained"
            autoFocus
          >
            Deallocate
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MultiplePersonsDialog;
