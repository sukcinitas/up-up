import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";
import { connect } from "react-redux";
import { logoutCurrentUser } from "../../redux/actions";

const Header = ({isLoggedIn, logout}) => {
    return (
        <header className="header">
            <h1 className="header__heading"><Link to="/">Voting App</Link></h1>
            <div className="header__links">
                {isLoggedIn ? 
                    <>
                        <Link to="/user/profile" className="link">Profile</Link>
                        <button onClick={logout}>Sign out</button>
                    </>
                    :
                    <>
                        <Link to="/user/login" className="link">Login</Link>
                        <Link to="/user/register" className="link">Register</Link>
                    </>
                }
            </div>
        </header>
    )
}
const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logoutCurrentUser())
});

const mapStateToProps = state => ({
    isLoggedIn: Boolean(state.userId) 
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);