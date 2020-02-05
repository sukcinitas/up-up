import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
axios.defaults.withCredentials = true;
import UserPolls from "../UserPolls/UserPolls";

class Profile extends React.Component {
    constructor(props) {
        super();
        this.state = {
            email: "",
            newEmail: "",
            newPassword: "",
            oldPassword: "",
            isChangingEmail: false,
            isChangingPassword: false,
            message: {
                emailChange: "",
                passwordChange: ""
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.showEmailChange = this.showEmailChange.bind(this);
        this.showPasswordChange = this.showPasswordChange.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.getEmail = this.getEmail.bind(this);
    }
    componentDidMount(){
        this.getEmail();
    };
    getEmail(){
        axios.get(`http://localhost:8080/api/user/profile/${this.props.username}`)
            .then(res => {
                const { email } = res.data.user[0]
                this.setState({
                    email
                });
            })
            .catch(error => {
                console.error(error);
            });
    };
    showEmailChange(){
        this.setState({ isChangingEmail : true});
    };

    showPasswordChange(){
        this.setState({ isChangingPassword : true});
    };

    handleChange(e){
        this.setState({ [e.target.name]: e.target.value})
    };
    changeEmail(){
        axios("http://localhost:8080/api/user/profile", {
            method: "put",
            data: {
                parameter: "email",
                _id: this.props.userId,
                email: this.state.newEmail
            }
        }).then(res => {
            this.getEmail();
            this.setState({
                message: {
                    emailChange: res.data.message
                },
                isChangingEmail: false
            });
        });
    };
    changePassword(){
        axios("http://localhost:8080/api/user/profile", {
            method: "put",
            data: {
                parameter: "password",
                _id: this.props.userId,
                oldpassword: this.state.oldPassword,
                newpassword: this.state.newPassword,
                username: this.props.username
            }
        }).then(res => {
            this.setState({
                message: {
                    passwordChange: res.data.message
                },
                isChangingPassword: false
            });
        });
    }
    render() {
        return(
            <div>
                <section>
                    <h2>User information</h2>
                    <div>
                        <div>
                            <p>Username: {this.props.username}</p>
                        </div>
                        <div>
                            <p>Email: {this.state.email}</p><button onClick={this.showEmailChange}>Change email</button>
                            {this.state.message.emailChange ? <span>{this.state.message.emailChange}</span> : ""}
                            {this.state.isChangingEmail ? 
                                <div>
                                    <input value={this.state.newEmail} name="newEmail" onChange={this.handleChange}/>
                                    <button onClick={this.changeEmail}>Change</button>
                                </div>
                                : ""
                            }
                        </div>
                        <div>
                        <button onClick={this.showPasswordChange}>Change password</button>
                        {this.state.message.passwordChange ? <span>{this.state.message.passwordChange}</span> : ""}
                            {this.state.isChangingPassword ? 
                                <div>
                                    Old password: <input value={this.state.oldPassword} name="oldPassword" onChange={this.handleChange}/>
                                    New password:<input value={this.state.newPassword} name="newPassword" onChange={this.handleChange}/>
                                    <button onClick={this.changePassword}>Change password</button>
                                </div>
                                : ""
                            }
                        </div>
                    </div>
                </section>
                <section>
                    <h2>Polls</h2>
                    <UserPolls username={this.props.username}/>
                    <Link to="/user/create-poll">Create a poll</Link>
                </section>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    username: state.username,
    userId: state.userId
});

export default connect(mapStateToProps)(Profile);