import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const AnalyticsReports = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Analytics & Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analytics and reports component will be implemented here
        </Typography>
      </Paper>
    </Container>
  );
};

export { AnalyticsReports };
export default AnalyticsReports;
