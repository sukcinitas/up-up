import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { logoutCurrentUser } from '../../store/reducers/usersSlice';
import { RootState } from '../../store';
import '../../sass/Header.scss';

axios.defaults.withCredentials = true;

const Header = () => {
  const username = useSelector((state: RootState) => state.users.username);
  const isLoggedIn = useSelector((state: RootState) => Boolean(state.users.userId));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    axios.get('/api/user/logout').then((res) => {
      if (res.data.success) {
        dispatch(logoutCurrentUser());
        navigate('/user/login');
      }
    });
  };

  return (
    <header className="header">
      <h1 className="header__heading">
        <Link to="/" className="header__link">
          VA
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

export default Header;
