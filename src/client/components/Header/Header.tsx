import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link, RouteComponentProps } from 'react-router-dom';
import { logoutCurrentUser, AppState } from '../../redux/actions';
import '../../sass/Header.scss';

axios.defaults.withCredentials = true;

const Header = ({ history }: RouteComponentProps) => {
  const { username, isLoggedIn } = useSelector((state: AppState) => ({
    username: state.username,
    isLoggedIn: Boolean(state.userId),
  }));
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    axios.get('/api/user/logout').then((res) => {
      if (res.data.success) {
        dispatch(logoutCurrentUser());
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
              className="btn btn--accent"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/user/login" className="btn btn--bold">
              Login
            </Link>
            <Link to="/user/register" className="btn btn--accent">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};

export default Header;
