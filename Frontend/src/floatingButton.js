import React, { useState, useRef } from 'react';
import { IconButton, Tooltip, Box, Typography } from '@mui/material';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';

const FloatingButton = ({ isDarkMode, onClick }) => {
    const [rotate, setRotate] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 16, y: 16 });
    const buttonRef = useRef(null);

    const handleMouseDown = (e) => {
        setDragging(true);
        // Capture the initial position of the mouse and button
        const offsetX = e.clientX - buttonRef.current.getBoundingClientRect().left;
        const offsetY = e.clientY - buttonRef.current.getBoundingClientRect().top;

        const handleMouseMove = (moveEvent) => {
            if (dragging) {
                setPosition({
                    x: moveEvent.clientX - offsetX,
                    y: moveEvent.clientY - offsetY
                });
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleClick = () => {
        setRotate(true);
        onClick();
        // Reset rotation after animation duration
        setTimeout(() => setRotate(false), 300); // Match this with the animation duration
    };

    return (
        <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <Box
                ref={buttonRef}
                sx={{
                    position: 'fixed',
                    bottom: position.y,
                    right: position.x,
                    zIndex: 1200, // Ensure the button is above other content
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: '50%',
                    boxShadow: 3,
                    transition: 'transform 0.3s ease',
                    transform: rotate ? 'rotate(360deg)' : 'rotate(0deg)',
                    cursor: dragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleMouseDown}
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
