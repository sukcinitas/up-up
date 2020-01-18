import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <header class="header">
            <h1 class="header__heading"><Link to="/">Voting App</Link></h1>
            <div class="header__links">
                <Link to="/user/login" class="link">Login</Link>
                <Link to="/user/register" class="link">Register</Link>
            </div>
        </header>
    )
}

export default Header;