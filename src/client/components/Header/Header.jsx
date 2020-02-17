import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutCurrentUser } from '../../redux/actions';
import './Header.scss';

axios.defaults.withCredentials = true;

const Header = ({
  isLoggedIn, logout, history, username,
}) => {
  const handleLogout = () => {
    axios.delete('http://localhost:8080/api/user/logout')
      .then(() => {
        logout();
        history.push('/user/login');
      });
  };
  return (
    <header className="header">
      <h1 className="header__heading"><Link to="/">Voting App</Link></h1>
      <div className="header__links">
        {isLoggedIn
          ? (
            <>
              <Link to="/user/profile" className="header__profile">{username}</Link>
              <button type="button" onClick={handleLogout} className="header__signout">Sign out</button>
            </>
          )
          : (
            <>
              <Link to="/user/login" className="header__login">Login</Link>
              <Link to="/user/register" className="header__register">Register</Link>
            </>
          )}
      </div>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  logout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

const mapStateToProps = (state) => ({
  isLoggedIn: Boolean(state.userId),
  username: state.username,
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
