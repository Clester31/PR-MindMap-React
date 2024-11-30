import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ContextProvider } from "./context/Context";

createRoot(document.getElementById("root")!).render(
  <ContextProvider>
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>
  </ContextProvider>
);
