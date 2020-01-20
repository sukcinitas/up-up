import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <header className="header">
            <h1 className="header__heading"><Link to="/">Voting App</Link></h1>
            <div className="header__links">
                <Link to="/user/login" className="link">Login</Link>
                <Link to="/user/register" className="link">Register</Link>
            </div>
        </header>
    )
}

export default Header;