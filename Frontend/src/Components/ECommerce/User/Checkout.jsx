import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Checkout = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Checkout component will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export { Checkout };
export default Checkout;
