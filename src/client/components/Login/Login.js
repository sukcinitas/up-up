import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { connect } from "react-redux";
import { receiveCurrentUser } from "../../redux/actions";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        axios.post("http://localhost:8080/api/user/login", {
            username: this.state.username,
            password: this.state.password,
        }).then(res => {
            // res.data.isAuthenticated? this.props.history.push("/") : this.setState({error: res.data.error})
                res.data.isAuthenticated ? this.props.login(res.data.sessionUser) : this.setState({error: res.data.error});
            }
        );   
    }
    render() {
       return (
            <form className="form">

                <h1>Login</h1>

                <label htmlFor="username" className="label">Username</label>
                <input type="text" name="username" onChange={this.handleChange} className="input"></input>

                <label htmlFor="password" className="label">Password</label>
                <input type="password" name="password" onChange={this.handleChange} className="input"></input>

                <button onClick={this.handleSubmit} className="label">Login</button>

                <span>{this.state.error}</span>

                <span>Don't have an account? <Link to="/user/register">Register</Link></span>

            </form> 
        ) 
    }
    
}
const mapDispathToProps = dispatch => ({
    login: user => dispatch(receiveCurrentUser(user))
});

export default connect(null, mapDispathToProps)(Login);