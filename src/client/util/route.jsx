/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
// with Router is needed sot that Auth and Protected children would
// have certain properties: history, etc.

const mapStateToProps = (state) => ({
  // isLoggedIn: Boolean(userId) //we get null or id, convert to boolean, is state to login or auth
  isLoggedIn: Boolean(state.userId),
});

const Auth = ({ isLoggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={(props) => (
      isLoggedIn ? <Redirect to="/" from="/" /> : <Component {...props} />
    )}
  />
);

const Protected = ({ isLoggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={(props) => (
      isLoggedIn ? <Component {...props} /> : <Redirect to="/user/login" from="/" />
    )}
  />
);

Auth.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  // path: ReactRouterPropTypes.path.isRequired,
  // component: PropTypes.elementType.isRequired,
};

Protected.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  // path: ReactRouterPropTypes.path.isRequired,
  // component: PropTypes.Profile.isRequired,
};

export const AuthRoute = withRouter(
  connect(mapStateToProps)(Auth),
);

export const ProtectedRoute = withRouter(
  connect(mapStateToProps)(Protected),
);
