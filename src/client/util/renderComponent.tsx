import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";

import usersReducer from '../store/reducers/usersSlice';
import { RootState } from "../store";
  
export const renderComponent = (ui: JSX.Element, options: { preloadedState: RootState }) => {
  const mockStore = configureStore({
    reducer: {
      users: usersReducer,
    },
    preloadedState: options.preloadedState,
  });

  const ProviderWrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={mockStore}>
        <Router>
          {children}
        </Router>
      </Provider>
  );

  return render(ui, { wrapper: ProviderWrapper, ...options }); 
}
