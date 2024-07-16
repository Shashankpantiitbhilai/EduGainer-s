import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const SeatInfoDialog = ({
  open,
  onClose,
  selectedSeat,
  seatStatus,
  onStatusChange,
  onViewDetails,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Seat Information</DialogTitle>
    <DialogContent>
      <Typography>Seat Number: {selectedSeat}</Typography>
      <Typography>Status: {seatStatus[selectedSeat] || "No Status"}</Typography>
      {seatStatus[selectedSeat] === "Paid" && (
        <>
          <Typography>Name: John Doe</Typography>
          <Typography>Email: johndoe@example.com</Typography>
          <Typography>Phone: +1234567890</Typography>
        </>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => onStatusChange("Paid")} color="primary">
        Alott Seat
      </Button>
     
      <Button onClick={onViewDetails} color="info">
        View Details
      </Button>
      <Button onClick={onClose} color="inherit">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default SeatInfoDialog;
