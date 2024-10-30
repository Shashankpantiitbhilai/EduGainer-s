// DarkModeToggle.js
import React from 'react';
import { IconButton, Tooltip, Box, Typography, useTheme } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';

const DarkModeToggle = ({ isDarkMode, onToggle }) => {
    const theme = useTheme();

    return (
        <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} placement="right">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: '24px',
                    boxShadow: theme.shadows[3],
                    padding: '4px',
                    cursor: 'pointer',
                }}
            >
                <IconButton
                    onClick={onToggle}
                    color="inherit"
                    sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    {isDarkMode ? (
                        <Brightness7Icon sx={{ color: theme.palette.warning.main }} />
                    ) : (
                        <Brightness4Icon sx={{ color: theme.palette.primary.main }} />
                    )}
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
    );
};

export default DarkModeToggle;
