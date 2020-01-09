import React from "react";

const SignInForm = () => {
    return (
        <form>
            <div>
                <label for="username">Username</label>
                <input type="text" name="signin-username"></input>
            </div>
            <div>
                <label for="password">Password</label>
                <input type="password" name="signin-password"></input>
            </div>
            <div>
                <button>Sign in</button>
                <span>Don't have an account?</span><button>Sign up</button>
            </div>
        </form>
        
    )
}

export default SignInForm;