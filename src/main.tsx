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
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <StoreProvider>
            <AppThemeProvider>
              <CssBaseline />
              <Toaster richColors position="top-right" />
              <App />
            </AppThemeProvider>
          </StoreProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);