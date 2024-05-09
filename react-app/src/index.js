import React from "react";
import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import { ModalProvider, Modal } from "./context/Modal";
import configureStore from "./store";
import * as sessionActions from "./store/session";
import App from "./App";
import "./index.css";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
	window.store = store;
	window.sessionActions = sessionActions;
}

// Note to self:
// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
function SocketProviderWrapper() {
    const currentUser = useSelector(state => state.session.user);

    return (
        <SocketProvider currentUser={currentUser}>
            <ModalProvider>
                <BrowserRouter>
                    <App />
                    <Modal />
                </BrowserRouter>
            </ModalProvider>
        </SocketProvider>
    );
}

// Root Component
function Root() {
    return (
        <Provider store={store}>
            <SocketProviderWrapper />
        </Provider>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById("root")
);