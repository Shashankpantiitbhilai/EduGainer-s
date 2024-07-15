import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

const DetailedPersonDialog = ({ open, onClose, selectedPerson }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Detailed Person Information</DialogTitle>
    <DialogContent>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          {selectedPerson?.name}
        </Typography>
        {selectedPerson && Object.entries(selectedPerson || {}).map(
          ([key, value]) =>
            key !== "name" && (
              <Typography key={key} variant="body1">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                {value}
              </Typography>
            )
        )}
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" variant="contained">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default DetailedPersonDialog;
