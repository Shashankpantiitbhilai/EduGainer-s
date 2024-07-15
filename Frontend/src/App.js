import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import { fetchCredentials } from "./services/auth";
import LoadingAnimation from "./Components/loadingAnimation/loading.jsx"
// Import the LoadingAnimation component

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
        <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
            <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
                <BrowserRouter>
                    <Main />
                </BrowserRouter>
            </LoadingContext.Provider>
        </AdminContext.Provider>
    );
}

export { AdminContext, LoadingContext };
export default App;