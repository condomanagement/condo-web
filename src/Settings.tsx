import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import PasskeySettings from './PasskeySettings';

export default function Settings(): React.ReactElement {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <PasskeySettings />
      </Paper>
    </Container>
  );
}
