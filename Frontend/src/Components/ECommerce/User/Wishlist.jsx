import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Wishlist = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Wishlist component will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export { Wishlist };
export default Wishlist;
