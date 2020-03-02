import * as React from 'react';
import * as PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { logoutCurrentUser, ActionTypes, AppState } from '../../redux/actions';
import './Header.scss';

axios.defaults.withCredentials = true;

interface IHeaderStateProps {
  isLoggedIn:boolean,
  username:string,
};

interface IHeaderRouteProps extends RouteComponentProps {};

interface IHeaderDispatchProps {
  logout: () => void,
};

type AllProps = IHeaderStateProps & IHeaderDispatchProps & IHeaderRouteProps;

const Header:React.FunctionComponent<AllProps> = ({
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

const mapDispatchToProps = (dispatch:Dispatch<ActionTypes>) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

const mapStateToProps = (state:AppState) => ({
  isLoggedIn: Boolean(state.userId),
  username: state.username,
});

export default connect<IHeaderStateProps, IHeaderDispatchProps, AllProps, AppState>(mapStateToProps, mapDispatchToProps)(Header);
