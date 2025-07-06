import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const CustomerManagement = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Customer Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customer management component will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export { CustomerManagement };
export default CustomerManagement;
