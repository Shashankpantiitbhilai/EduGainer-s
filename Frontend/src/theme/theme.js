// theme.js
import { createTheme } from '@mui/material/styles';

// Define a common color palette
const commonColors = {
    primary: '#4caf50', // Green
    secondary: '#ff9800', // Orange
    warning: '#ffeb3b', // Yellow
    error: '#f44336', // Red
};

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: commonColors.primary,
        },
        secondary: {
            main: commonColors.secondary,
        },
        warning: {
            main: commonColors.warning,
        },
        error: {
            main: commonColors.error,
        },
        background: {
            default: '#fafafa', // Light background
        },
        text: {
            primary: '#000000', // Dark text on light background
            secondary: '#555555', // Slightly lighter text
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: commonColors.primary,
        },
        secondary: {
            main: commonColors.secondary,
        },
        warning: {
            main: commonColors.warning,
        },
        error: {
            main: commonColors.error,
        },
        background: {
            default: '#303030', // Dark background
        },
        text: {
            primary: '#ffffff', // Light text on dark background
            secondary: '#bbbbbb', // Slightly darker text
        },
    },
});

export { lightTheme, darkTheme };
