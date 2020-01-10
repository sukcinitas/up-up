import React from "react";

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signup_username: "",
            signup_email: "",
            signup_password: "",
            signup_confirm_password: "",
            passwords_match: true
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
        //should lead to user page or not
        if (this.state.signup_password !== this.state.signup_confirm_password) {
            this.setState({
                passwords_match: false
            })
            e.preventDefault();
            return;
        } else {
            this.setState({
                passwords_match: true
            })
            e.preventDefault();
            
        }

    }
    render() {
       return (
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="signup_username" onChange={this.handleChange}></input>
                </div>
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" name="signup_email" onChange={this.handleChange}></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="signup_password" onChange={this.handleChange}></input>
                </div>
                <div>
                    <label htmlFor="password">Repeat Password</label>
                    <input type="password" name="signup_confirm_password" onChange={this.handleChange}></input>
                </div>
                <div>
                    <button onClick={this.handleSubmit}>Sign up</button>
                    <span>Already have an account?</span><button>Sign in</button>
                </div>
                {this.state.passwords_match ? "" : <span>Passwords should match</span>}
            </form>
        
        )
    } 
}

export default SignUpForm;