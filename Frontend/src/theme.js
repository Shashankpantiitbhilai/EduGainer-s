// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2ecc71",
        },
        secondary: {
            main: "#f1c40f",
        },
        text: {
            primary: "#2c3e50",
        },
        background: {
            default: "#ecf0f1",
        },
        white: {
            main: "#ffffff",
        },
    },
});

export default theme;
