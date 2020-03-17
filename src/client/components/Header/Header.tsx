import * as React from 'react';
import * as PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { logoutCurrentUser, ActionTypes, AppState } from '../../redux/actions';
import '../../sass/Header.scss';

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
    axios.get('http://localhost:8080/api/user/logout')
      .then(() => {
        logout();
        history.push('/user/login');
      });
  };
  return (
    <header className="header">
      <h1><Link to="/" className="header__heading">V.</Link></h1>
      <div>
        {isLoggedIn
          ? (
            <>
              <Link to="/user/profile" className="btn btn--username">{username}</Link>
              <button type="button" onClick={handleLogout} className="btn">Sign out</button>
            </>
          )
          : (
            <>
              <Link to="/user/login" className="btn btn--bold">Login</Link>
              <Link to="/user/register" className="btn">Register</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
