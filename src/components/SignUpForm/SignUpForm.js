import React from "react";

const SignUpForm = ()=> {
    return (
        <form>
            <div>
                <label for="username">Username</label>
                <input type="text" name="signup-username"></input>
            </div>
            <div>
                <label for="email">E-mail</label>
                <input type="email" name="signup-email"></input>
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" name="signup-password"></input>
            </div>
            <div>
                <label for="password">Repeat Password</label>
                <input type="password" name="signup-confirm_password"></input>
            </div>
            <div>
                <button>Sign up</button>
                <span>Already have an account?</span><button>Sign in</button>
            </div>
        </form>
        
    )

}

export default SignUpForm;