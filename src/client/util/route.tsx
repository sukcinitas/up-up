import React from 'react';
// import  PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import { useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { AppState } from '../redux/actions';

interface RouteProps extends RouteComponentProps {
  path: string;
  component: any;
}

const Auth = ({ path, component: Component }: RouteProps) => {
  const { isLoggedIn } = useSelector((state: AppState) => ({
    isLoggedIn: Boolean(state.userId),
  }));
  return (
    <Route
      path={path}
      render={() =>
        isLoggedIn ? <Redirect to="/" from="/" /> : <Component />
      }
    />
  );
};

const Protected = ({
  path,
  component: Component,
  history,
}: RouteProps) => {
  const { isLoggedIn } = useSelector((state: AppState) => ({
    isLoggedIn: Boolean(state.userId),
  }));
  return (
    <Route
      path={path}
      render={() =>
        isLoggedIn ? (
          <Component history={history} />
        ) : (
          <Redirect to="/user/login" from="/" />
        )
      }
    />
  );
};

// Auth.propTypes = {
//   path: ReactRouterPropTypes.path.isRequired,
//   component: PropTypes.elementType.isRequired,
// };

// Protected.propTypes = {
//   path: ReactRouterPropTypes.path.isRequired,
//   component: PropTypes.elementType.isRequired,
// };

export const AuthRoute = withRouter(Auth);

export const ProtectedRoute = withRouter(Protected);
