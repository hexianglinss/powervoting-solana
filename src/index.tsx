import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from './contexts/ContextProvider';
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider>

);