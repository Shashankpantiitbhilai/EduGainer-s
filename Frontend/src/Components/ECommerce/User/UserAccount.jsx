import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const UserAccount = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          User Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          User account component will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export { UserAccount };
export default UserAccount;
