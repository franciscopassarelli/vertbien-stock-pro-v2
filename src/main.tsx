import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AppThemeProvider } from "./AppThemeProvider";
import App from "./App";

// Importa tus providers
import { AuthProvider } from "./lib/auth"; 
import { SettingsProvider } from "./lib/settings";
import { StoreProvider } from "./lib/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <StoreProvider>
            <AppThemeProvider>
              <CssBaseline />
              <App />
            </AppThemeProvider>
          </StoreProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);