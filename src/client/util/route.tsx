import React from 'react';
// import  PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import { AppState } from '../redux/actions';

interface RouteProps extends RouteComponentProps {
  path: string;
  component: any;
}

const Auth = ({ children }) => {
  const { isLoggedIn } = useSelector((state: AppState) => ({
    isLoggedIn: Boolean(state.userId),
  }));
  if (isLoggedIn) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};

const Protected = ({ children }) => {
  const { isLoggedIn } = useSelector((state: AppState) => ({
    isLoggedIn: Boolean(state.userId),
  }));
  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to="/user/login" />;
  }
};

export const AuthRoute = Auth;

export const ProtectedRoute = Protected;
