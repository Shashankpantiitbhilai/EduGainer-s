import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { ProductFruits } from 'react-product-fruits';

function TourDialog() {
  const [open, setOpen] = useState(true);

  const handleStartTour = () => {
    setOpen(false);
    if (window.productFruits) {
      window.productFruits.startTour('89331');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Welcome!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to take a quick tour of our application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No, thanks
          </Button>
          <Button onClick={handleStartTour} color="primary" autoFocus>
            Yes, show me
          </Button>
        </DialogActions>
      </Dialog>
      <ProductFruits workspace="HhNlcU8cABhfohpR" />
    </>
  );
}

export default TourDialog;
