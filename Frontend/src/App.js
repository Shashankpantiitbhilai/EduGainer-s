import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./Main";
import { fetchCredentials } from "./services/auth";

const AdminContext = createContext();

function App() {
    const [IsUserLoggedIn, setIsUserLoggedIn] = useState(null);

    useEffect(() => {
        fetchCredentials().then((User) => {
            if (User) {
                setIsUserLoggedIn(User);
            }
        });
    }, []);

    console.log(IsUserLoggedIn);

    return (
        <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
            <BrowserRouter>
                <Main />
            </BrowserRouter>
        </AdminContext.Provider>
    );
}

export { AdminContext };
export default App;
