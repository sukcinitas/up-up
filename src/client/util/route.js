import React from "react";
import { connect } from  "react-redux";
import { Redirect, Route, withRouter } from "react-router-dom";
//with Router is needed sot that Auth and Protected children would have certain properties: history, etc.

const mapStateToProps = (state) => ({
    // isLoggedIn: Boolean(userId) //we get null or id, convert to boolean, is state to login or auth
    isLoggedIn: Boolean(state.userId)
});

const Auth = ({ isLoggedIn, path, component: Component}) => (
    <Route
        path={path}
        render={props => (
            isLoggedIn ? <Redirect to="/" /> : <Component {...props} />
        )}
    />
);

const Protected = ({ isLoggedIn, path, component: Component }) => (
    <Route
      path={path}
      render={props => (
        isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />
      )}
    />
  );


export const AuthRoute = withRouter(
    connect(mapStateToProps)(Auth)
);

export const ProtectedRoute = withRouter(
    connect(mapStateToProps)(Protected)
);
