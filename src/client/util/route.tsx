import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';

const Auth = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useSelector((state: RootState) => ({
    isLoggedIn: Boolean(state.users.userId),
  }));
  if (isLoggedIn) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
};

const Protected = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useSelector((state: RootState) => ({
    isLoggedIn: Boolean(state.users.userId),
  }));
  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to="/user/login" />;
  }
};

export const AuthRoute = Auth;

export const ProtectedRoute = Protected;
