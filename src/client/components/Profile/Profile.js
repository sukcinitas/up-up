import React from "react";
import axios from "axios";
import UserPolls from "../UserPolls/UserPolls";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Profile extends React.Component {
    constructor(props) {
        super();
        this.state = {
            email: "",
            emailChange: "",
            passwordChange: "",
            oldPasswordChange: "",
            isChangingEmail: false,
            isChangingPassword: false,
            message: ""
        }
        this.showEmailChange = this.showEmailChange.bind(this);
        this.showPasswordChange = this.showPasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount(){
        axios.get(`http://localhost:8080/api/user/profile/${this.props.username}`, { withCredentials: true })
            .then(res => {
                const { email } = res.data.user[0]
                this.setState({
                    email
                });
            })
            .catch(error => {
                console.error(error);
            })
    };

    showEmailChange(){
        this.setState({ isChangingEmail : true});
    };

    showPasswordChange(){
        this.setState({ isChangingPassword : true});
    };

    handleChange(e){
        this.setState({ [e.target.name]: e.target.value})
    }
    handleEmailChange(){
        axios("http://localhost:8080/api/user/profile", {
            method: "put",
            withCredentials: true,
            data: {
                parameter: "email",
                _id: this.props.userId,
                email: this.state.emailChange
            }
        }).then(res => {
            this.setState({
                message: res.data.message
            })
        })
    };
    handlePasswordChange(){
        axios("http://localhost:8080/api/user/profile", {
            method: "put",
            withCredentials: true,
            data: {
                parameter: "password",
                _id: this.props.userId,
                oldpassword: this.state.oldPasswordChange,
                newpassword: this.state.passwordChange,
                username: this.props.username
            }
        }).then(res => {
            this.setState({
                message: res.data.message
            })
        })
    }
    render() {
        return(
            <div>
                <h2>User information</h2>
                <div>
                    {this.state.message ? <span>{this.state.message}</span> : ""}
                    <p>username: {this.props.username}</p>
                    <p>email: {this.state.email}</p><button onClick={this.showEmailChange}>Change email</button>
                    {this.state.isChangingEmail ? 
                        <div>
                            <input value={this.state.value} name="emailChange" onChange={this.handleChange}/>
                            <button onClick={this.handleEmailChange}>Change email</button>
                        </div>
                        : ""
                    }
                    <button onClick={this.showPasswordChange}>Change password</button>
                    {this.state.isChangingPassword ? 
                        <div>
                            Old password: <input value={this.state.value} name="oldPasswordChange" onChange={this.handleChange}/>
                            New password:<input value={this.state.value} name="passwordChange" onChange={this.handleChange}/>
                            <button onClick={this.handlePasswordChange}>Change password</button>
                        </div>
                        : ""
                    }
                </div>
                <h2>Polls</h2>
                <UserPolls username={this.props.username}/>
                <Link to="/user/create-poll">Create a poll</Link>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    username: state.username,
    userId: state.userId
});

export default connect(mapStateToProps)(Profile);