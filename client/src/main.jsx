import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SocketProvider } from "./contexts/SocketProvider.jsx";
import { store } from "./store/store.js";
import { persistStore } from "redux-persist";
import { AppContextProvider } from "./contexts/AppContext.jsx";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppContextProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistStore(store)}>
            <SocketProvider>
              <Router>
                <App />
              </Router>
            </SocketProvider>
          </PersistGate>
        </Provider>
      </AppContextProvider>
    </HelmetProvider>
  </React.StrictMode>
);
