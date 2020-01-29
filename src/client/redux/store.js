import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";

// const preloadedState = {session: true}; //get with

export default
  createStore(
    reducer, 
    // preloadedState, 
    applyMiddleware(thunk)
  );