import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirm_password: "",
            redirect: false,
            errors: {
                username: "",
                email: "",
                password: "",
                passwords_match: true,           
                username_taken: false,
                email_taken: false, 
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        let { errors } = this.state;
        switch(e.target.name) {
            case "username":
                errors.username = e.target.value.length < 5 ? "username must be at least 5 characters long"
                : (e.target.name.length > 30 ? "username is too long" : "");
                break;
            case "email":
                errors.email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.target.value) ?
                "" : "email is not valid"
                break;
            case "password": 
                errors.password = e.target.value.length < 6 ? "password must be at least 6 characters long" : "";
                break;
            case "confirm_password":
                errors.passwords_match = this.state.password === e.target.value ? "" : "passwords should match";
                break;
            default: ""
                break;
        } 
        this.setState({
            errors, 
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e){
        e.preventDefault();
        const { username, email, password, passwords_match } = this.state.errors;
        if (username !== "" || email !== "" || password !== "" || passwords_match !== "") {
            return;
        } else {
            const user = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
        }

        axios.post("http://localhost:8080/api/user/register", user)
            .then(res => {
                const newErrors = Object.assign({}, this.state.errors, {
                    username_taken: res.data.username_taken || false,
                    email_taken: res.data.email_taken || false 
                });
                this.setState({
                    redirect: res.data.redirect || false,
                    errors: newErrors
                }, () => {
                    res.data.redirect ? this.props.history.push("/user/login") : "";
                }); 
            });
        }
    }

    render() {
        const { username, email, password, passwords_match, username_taken, email_taken} = this.state.errors;
        return (
            <form className="form">
                    <h1>Register</h1>

                    <label 
                        htmlFor="username" 
                        className="label">Username <span className="notes">{username}</span>
                    </label>
                    <input 
                        type="text" 
                        name="username" 
                        onChange={this.handleChange} 
                        className="input"
                        required
                    >
                    </input>

                    <label 
                        htmlFor="email" 
                        className="label">E-mail<span className="notes"> {email}</span>
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        onChange={this.handleChange} 
                        className="input"
                        required
                    >
                    </input>

                    <label 
                        htmlFor="password" 
                        className="label">Password<span className="notes"> {passwords_match}</span>
                        <span className="notes"> {password}</span>
                    </label>
                    <input 
                        type="password" 
                        name="password" 
                        onChange={this.handleChange} 
                        className="input"
                        required
                        >
                    </input>

                    <label 
                        htmlFor="password" 
                        className="label">Repeat Password <span className="notes"> {passwords_match}</span>
                    </label>
                    <input 
                        type="password" 
                        name="confirm_password" 
                        onChange={this.handleChange} className="input"
                        required
                    >
                    </input>

                    <div>
                         <span className="notes"> {username_taken ? "username is already in use" : ""}</span>
                         <span className="notes">{email_taken ? "email is already in use" : ""}</span>
                    </div>

                    <button onClick={this.handleSubmit} className="label">Register</button>
                    <span>Already have an account? <Link to="/user/login">Login</Link></span>  
            </form>
        
        )
    } 
}

export default Register;