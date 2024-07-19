import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import { fetchCredentials } from "./services/auth";
import LoadingAnimation from "./Components/loadingAnimation/loading.jsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import NotificationWrapper from "../src/Components/Library/notification-wrapper.jsx"; // Import the NotificationWrapper

const AdminContext = createContext();
const LoadingContext = createContext();

function App() {
    const [IsUserLoggedIn, setIsUserLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchCredentials().then((User) => {
            if (User) {
                setIsUserLoggedIn(User);
            }
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
                <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
                    <BrowserRouter>
                        {IsUserLoggedIn ? <NotificationWrapper>
                            <Main />
                        </NotificationWrapper> :< Main/>}
                    </BrowserRouter>
                </LoadingContext.Provider>
            </AdminContext.Provider>
        </ThemeProvider>
    );
}

export { AdminContext, LoadingContext };
export default App;