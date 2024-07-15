import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const PaymentFormDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  onSubmit,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Payment Form</DialogTitle>
    <DialogContent>
      {Object.entries(formData).map(([key, value]) => (
        <TextField
          key={key}
          margin="dense"
          id={key}
          label={key}
          type={
            key === "Cash" || key === "Online" || key === "Fee"
              ? "number"
              : "text"
          }
          fullWidth
          value={value}
          onChange={(e) => onFormChange(key, e.target.value)}
        />
      ))}
    </DialogContent>
    <DialogActions>
      <Button onClick={onSubmit} color="primary">
        Submit
      </Button>
      <Button onClick={onClose} color="inherit">
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default PaymentFormDialog;
