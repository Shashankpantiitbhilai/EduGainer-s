/* eslint-disable */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import AddUser from "./AddUser";
import reportWebVitals from "./reportWebVitals";
// import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider, useGoogleOneTapLogin } from "@react-oauth/google";
// eslint-disable-next-line
import createSvgIcon from '@mui/material/utils/createSvgIcon';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
