import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ReduxProvider from "./shared/providers/ReduxProvider.tsx";
import Theme from "./shared/components/Theme.tsx";
import { AppContextProvider } from "./shared/context/AppContext.tsx";
import App from "./app.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider>
      <AppContextProvider>
        <App  />
        <Theme />
      </AppContextProvider>
    </ReduxProvider>
  </React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
