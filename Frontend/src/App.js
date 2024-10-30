import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";

import Main from "./Main";
import { fetchCredentials } from "./services/auth";
import LoadingAnimation from "./Components/loadingAnimation/loading.jsx";
import NotificationWrapper from "../src/Components/Library/notification-wrapper.jsx";
import FloatingButtons from "./floatingButton.js";
import GoogleReviews from "./Components/review-notify.jsx";

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

        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDarkMode(savedTheme === "dark");
        }
    }, []);

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
                <LoadingContext.Provider value={{ isLoading, setIsLoading, isDarkMode, setIsDarkMode }}>
                    <BrowserRouter>
                        {/* Google Reviews and Floating Buttons are added here */}
                        <GoogleReviews />
                        <FloatingButtons />

                        {IsUserLoggedIn ? (
                            <NotificationWrapper>
                                <Main />
                            </NotificationWrapper>
                        ) : (
                            <Main />
                        )}
                    </BrowserRouter>
                </LoadingContext.Provider>
            </AdminContext.Provider>
        </ThemeProvider>
    );
}

export { AdminContext, LoadingContext };
export default App;
