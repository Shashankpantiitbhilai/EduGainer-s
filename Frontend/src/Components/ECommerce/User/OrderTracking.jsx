import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const OrderTracking = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Order Tracking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Order tracking component will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export { OrderTracking };
export default OrderTracking;
