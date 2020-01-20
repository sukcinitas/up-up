import React from "react";

//only shown then logged in, then instead of login/register => logout, changes global state
//shows polls user have created with delete buttons
//shows settings => change details
//shows poll creation link

class Profile extends React.Component {
    constructor(props) {
        super();
        this.state = {
            username: "username",
            email: ""
        }
    }
//username must be global, from login
    componentDidMount(){
        axios.get("http://localhost:8080/api/user/profile", {username: this.state.username})
            .then(res => {
                const { name, email } = res.data.user[0]
                this.setState({
                    name, 
                    email
                })
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        return(
            <div>
                <h2>User information</h2>
                    <p>username: {this.state.username}</p>
                    <p>email: {this.state.email}</p><button>Change email</button>
                    <button>Change password</button>
            </div>
        );
    }
}

export default Profile;