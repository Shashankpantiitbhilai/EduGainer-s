import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Library from "./Library"; // Ensure this is the correct path to your Library component

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#fff",
      secondary: "#aaa",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Library />
    </ThemeProvider>
  );
}

export default App;
