import React from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signup_username: "",
            signup_email: "",
            signup_password: "",
            signup_confirm_password: "",
            passwords_match: true, 
            username_taken: false,
            email_taken: false, 
            redirect: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        if (this.state.signup_password !== this.state.signup_confirm_password) {
            this.setState({
                passwords_match: false,
                signup_password: "",
                signup_confirm_password: ""
            })
            return;
        } else {
            const user = {
                signup_username: this.state.signup_username,
                signup_email: this.state.signup_email,
                signup_password: this.state.signup_password,
            }

            axios.post("http://localhost:8080/api/user/register", user)
                .then(res => {
                    this.setState({
                        redirect: res.data.redirect || false,
                        username_taken: res.data.username_taken || false,
                        email_taken: res.data.email_taken || false
                    })
                });
        }

    }
    renderRedirect(){
        if (this.state.redirect) {
            return <Redirect to="/user/login"/>
        }
    }
    render() {
       return (
            <form class="form">
                    {this.renderRedirect()}
                    <h1>Register</h1>

                    <label 
                        htmlFor="username" 
                        class="label">Username 
                            <span class="notes">{this.state.username_taken ? "username is already in use" : ""}</span>
                    </label>
                    <input 
                        type="text" 
                        name="signup_username" 
                        onChange={this.handleChange} 
                        class="input"
                        required
                        minLength="5"
                        maxLength="20"
                    >
                    </input>

                    <label 
                        htmlFor="email" 
                        class="label">E-mail <span class="notes">{this.state.email_taken ? "email is already in use" : ""}</span>
                    </label>
                    <input 
                        type="email" 
                        name="signup_email" 
                        onChange={this.handleChange} 
                        class="input"
                        required
                        pattern="*@*"
                    >
                    </input>

                    <label 
                        htmlFor="password" 
                        class="label">Password <span class="notes">{this.state.passwords_match ? "" : "passwords should match"}</span>
                    </label>
                    <input 
                        type="password" 
                        name="signup_password" 
                        onChange={this.handleChange} 
                        class="input"
                        required
                        >
                    </input>

                    <label 
                        htmlFor="password" 
                        class="label">Repeat Password <span class="notes">{this.state.passwords_match ? "" : "passwords should match"}</span>
                    </label>
                    <input 
                        type="password" 
                        name="signup_confirm_password" 
                        onChange={this.handleChange} class="input"
                        required
                    >
                    </input>

                    <button onClick={this.handleSubmit} class="label">Register</button>
                    <span>Already have an account? <Link to="/user/login">Login</Link></span>

                    
            </form>
        
        )
    } 
}

export default Register;