import React, { useState } from 'react';
import { IconButton, Tooltip, Box, Typography } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';

const FloatingButton = ({ isDarkMode, onClick }) => {
    const [rotate, setRotate] = useState(false);

    const handleClick = () => {
        setRotate(true);
        onClick();
        // Reset rotation after animation duration
        setTimeout(() => setRotate(false), 300); // Match this with the animation duration
    };

    return (
        <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1200, // Ensure the button is above other content
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: '50%',
                    boxShadow: 3,
                    transition: 'transform 0.3s ease',
                    transform: rotate ? 'rotate(360deg)' : 'rotate(0deg)',
                }}
            >
                <IconButton
                    onClick={handleClick}
                    color="inherit"
                >
                    {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <Typography
                    variant="caption"
                    sx={{
                        ml: 1,
                        color: 'text.primary',
                        fontWeight: 'bold',
                    }}
                >
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </Typography>
            </Box>
        </Tooltip>
    );
};

export default FloatingButton;
