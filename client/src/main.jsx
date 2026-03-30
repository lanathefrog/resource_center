import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastViewport } from "./components/ToastViewport";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AppProvider>
          <App />
          <ToastViewport />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
