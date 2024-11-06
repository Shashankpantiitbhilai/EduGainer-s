import React, { useState } from 'react';
import { 
  IconButton, 
  Tooltip, 

  Box,
  Switch,
  Typography,
  FormControlLabel
} from '@mui/material';
import {
  VolumeUp,
  VolumeOff,
 
} from '@mui/icons-material';

// Sound Control Component
const SoundControl = ({ onToggle }) => {
  const [isSoundOn, setIsSoundOn] = useState(false);

  const handleToggle = () => {
    setIsSoundOn(!isSoundOn);
    if (onToggle) {
      onToggle(!isSoundOn);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
      <Tooltip title={isSoundOn ? "Turn sound off" : "Turn sound on"}>
        <IconButton 
          onClick={handleToggle}
          sx={{
            color: '#1a237e',
            '&:hover': {
              backgroundColor: 'rgba(26, 35, 126, 0.04)',
            },
          }}
        >
          {isSoundOn ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
      </Tooltip>
      <FormControlLabel
        control={
          <Switch 
            checked={isSoundOn}
            onChange={handleToggle}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#1a237e',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#1a237e',
              },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Text to Speech
          </Typography>
        }
      />
    </Box>
  );
};
export default SoundControl