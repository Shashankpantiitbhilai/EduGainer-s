import React, { useState } from 'react';
import { IconButton, Tooltip, Box, Typography, useTheme } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import Draggable from 'react-draggable';
import ChatPopup from './Components/AI/popup'; // Your existing ChatPopup component

const FloatingButtons = ({ isDarkMode, onThemeToggle }) => {
    const [rotate, setRotate] = useState(false);

    const theme = useTheme();

    const handleThemeClick = () => {
        setRotate(true);
        onThemeToggle();
        setTimeout(() => setRotate(false), 300);
    };

    return (
        <>
            {/* Left side - Theme Toggle */}
            <Draggable bounds="parent">
                <Tooltip
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    placement="right"
                >
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            left: 16,
                            zIndex: 1200,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '24px',
                            boxShadow: theme.shadows[3],
                            transition: 'all 0.3s ease',
                            transform: rotate ? 'rotate(360deg)' : 'rotate(0deg)',
                            '&:hover': {
                                boxShadow: theme.shadows[6],
                                backgroundColor: theme.palette.action.hover,
                            },
                            padding: '4px',
                            cursor: 'move',
                        }}
                    >
                        <IconButton
                            onClick={handleThemeClick}
                            color="inherit"
                            sx={{
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    transform: 'scale(1.1)',
                                }
                            }}
                        >
                            {isDarkMode ?
                                <Brightness7Icon sx={{ color: theme.palette.warning.main }} /> :
                                <Brightness4Icon sx={{ color: theme.palette.primary.main }} />
                            }
                        </IconButton>
                        <Typography
                            variant="caption"
                            sx={{
                                mx: 1,
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                                userSelect: 'none',
                                display: { xs: 'none', sm: 'block' },
                                minWidth: '70px',
                            }}
                        >
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </Typography>
                    </Box>
                </Tooltip>
            </Draggable>
            <Draggable bounds="parent">
            {/* Right side - Chat Button */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1200,
                }}
            >
                {/* Your existing ChatPopup component */}
                <ChatPopup />
            </Box></Draggable>
        </>
    );
};

export default FloatingButtons;