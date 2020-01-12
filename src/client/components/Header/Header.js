import React from "react";
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header>
            <h1><Link to="/">Voting App</Link></h1>
            <Link to="/sign-in">Sign in</Link>
            <Link to="/sign-up">Sign up</Link>
        </header>
    )
}

export default Header;