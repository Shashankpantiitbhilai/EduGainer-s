import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const CouponManagement = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Coupon Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coupon management component will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export { CouponManagement };
export default CouponManagement;
