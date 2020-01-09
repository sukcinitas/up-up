import React from "react";

class SignInForm extends React.Component {
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
            <form>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="signin_username" onChange={this.handleChange}></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="signin_password" onChange={this.handleChange}></input>
                </div>
                <div>
                    <button onClick={this.handleSubmit}>Sign in</button>
                    <span>Don't have an account?</span><button>Sign up</button>
                </div>
            </form> 
        ) 
    }
    
}

export default SignInForm;