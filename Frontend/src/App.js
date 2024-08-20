import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import { fetchCredentials } from "./services/auth";
import LoadingAnimation from "./Components/loadingAnimation/loading.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";

import NotificationWrapper from "../src/Components/Library/notification-wrapper.jsx"; // Import the NotificationWrapper
import FloatingButton from "./floatingButton.js";

// Create contexts
const AdminContext = createContext();
const LoadingContext = createContext();

function App() {
    const [IsUserLoggedIn, setIsUserLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchCredentials().then((User) => {
            if (User) {
                setIsUserLoggedIn(User);
            }
            setIsLoading(false);
        });

        // Load the theme preference from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }

        // Disable right-click
        // document.addEventListener('contextmenu', (event) => event.preventDefault());

        // // Disable common keyboard shortcuts
        const handleKeyDown = (event) => {
            if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                event.preventDefault();
            }
        };
        // document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', (event) => event.preventDefault());
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleThemeToggle = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            // Save the preference to localStorage
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
                <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
                    <BrowserRouter>
                        {IsUserLoggedIn ? (
                            <NotificationWrapper>
                                <LoadingAnimation />
                            </NotificationWrapper>
                        ) : (
                            <Main />
                        )}
                        <FloatingButton isDarkMode={isDarkMode} onClick={handleThemeToggle} />
                    </BrowserRouter>
                </LoadingContext.Provider>
            </AdminContext.Provider>
        </ThemeProvider>
    );
}

export { AdminContext, LoadingContext };
export default App;
