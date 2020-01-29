import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import { Provider } from "react-redux";
import axios from "axios";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./redux/reducers";

const checkSession = () => {
    let preloadedState = {};
    axios.get("http://localhost:8080/api/user/session")
         .then( (res) => {
        if (res.data.user) {
            preloadedState = res.data.user;
        };
    });
    return preloadedState;
}

const renderApp = preloadedState => {
    const store = createStore(reducer, preloadedState, applyMiddleware(thunk));
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, 
        document.getElementById("root"));
};

( async () => renderApp(await checkSession()))();

