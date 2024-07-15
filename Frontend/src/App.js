import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import { fetchCredentials } from "./services/auth";
import LoadingAnimation from "./Components/loadingAnimation/loading.jsx"
// Import the LoadingAnimation component
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
const AdminContext = createContext();
const LoadingContext = createContext();

function App() {
    const [IsUserLoggedIn, setIsUserLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchCredentials().then((User) => {
            console.log(User);
            if (User) {
                setIsUserLoggedIn(User);
            }
            setIsLoading(false);
        });
    }, []);

    console.log(IsUserLoggedIn);

    if (isLoading) {
        return <LoadingAnimation />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
        <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
            <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </LoadingContext.Provider>
            </AdminContext.Provider>
            </ThemeProvider>
    );
}

export { AdminContext, LoadingContext };
export default App;