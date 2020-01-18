import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signin_username: "",
            signin_password: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmit() {
        e.preventDefault();
        //lead to submitting
    }
    render() {
       return (
            <form class="form">

                <h1>Login</h1>

                <label htmlFor="username" class="label">Username</label>
                <input type="text" name="signin_username" onChange={this.handleChange} class="input"></input>

                <label htmlFor="password" class="label">Password</label>
                <input type="password" name="signin_password" onChange={this.handleChange} class="input"></input>

                <button onClick={this.handleSubmit} class="label">Login</button>

                <span>Don't have an account? <Link to="/user/register">Register</Link></span>

            </form> 
        ) 
    }
    
}

export default Login;