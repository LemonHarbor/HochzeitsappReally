import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./lib/theme";
import { LanguageProvider } from "./lib/language";
import { CurrencyProvider } from "./lib/currency";
import { DeveloperProvider } from "./lib/developer";
import { applyTheme, getActiveTheme } from "./lib/themes";

// Add error handling for routing issues
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);
});

// Apply the active color theme before rendering
const activeTheme = getActiveTheme();
applyTheme(activeTheme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <DeveloperProvider>
            <AuthProvider>
              <App />
              <Toaster />
            </AuthProvider>
          </DeveloperProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
