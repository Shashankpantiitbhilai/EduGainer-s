import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const PaymentFormDialog = ({ open, onClose, onFormSubmit }) => {
  const [regNo, setRegNo] = useState("");

  const handleSubmit = () => {
    onFormSubmit(regNo);
    setRegNo(""); // Reset the input after submission
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Seat Allotment Form</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          id="regNo"
          label="Reg No"
          type="text"
          fullWidth
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Allot
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentFormDialog;
