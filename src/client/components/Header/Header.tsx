import * as React from 'react';
import * as PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  logoutCurrentUser,
  ActionTypes,
  AppState,
} from '../../redux/actions';
import '../../sass/Header.scss';

axios.defaults.withCredentials = true;

interface IHeaderStateProps {
  isLoggedIn: boolean;
  username: string
}

interface IHeaderRouteProps extends RouteComponentProps {}

interface IHeaderDispatchProps {
  logout: () => void;
}

type AllProps = IHeaderStateProps &
  IHeaderDispatchProps &
  IHeaderRouteProps;

const Header: React.FunctionComponent<AllProps> = ({
  isLoggedIn,
  logout,
  history,
  username,
}) => {
  const handleLogout = () => {
    axios.get('/api/user/logout').then((res) => {
      if (res.data.success) {
        logout();
        history.push('/user/login');
      }
    });
  };
  return (
    <header className="header">
      <h1 className="header__heading">
        <Link to="/" className="header__link">
          VA.
        </Link>
      </h1>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/user/profile" className="btn btn--username">
              {username}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/user/login" className="btn btn--bold">
              Login
            </Link>
            <Link to="/user/register" className="btn">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.any.isRequired,
  logout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

const mapStateToProps = (state: AppState) => ({
  isLoggedIn: Boolean(state.userId),
  username: state.username,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
