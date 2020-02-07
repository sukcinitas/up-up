import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutCurrentUser } from '../../redux/actions';
import './Header.css';

axios.defaults.withCredentials = true;

const Header = ({ isLoggedIn, logout, history }) => {
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
              <Link to="/user/profile" className="link">Profile</Link>
              <button type="button" onClick={handleLogout}>Sign out</button>
            </>
          )
          : (
            <>
              <Link to="/user/login" className="link">Login</Link>
              <Link to="/user/register" className="link">Register</Link>
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
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

const mapStateToProps = (state) => ({
  isLoggedIn: Boolean(state.userId),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
