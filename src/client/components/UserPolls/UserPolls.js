import React from "react";
import axios from "axios";
//only shown then logged in, then instead of login/register => logout, changes global state
//shows polls user have created with delete buttons
//shows settings => change details
//shows poll creation link

class UserPolls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            username: "panemume",
            showDeletionMessage: false,
            userPolls: []
        }
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
    }
//username must be global, from login
    componentDidMount(){
        axios.get("http://localhost:8080/api/user/polls", { withCredentials: true }, {username: this.state.username})
            .then(res => {
                this.setState({
                    userPolls: [...res.data.polls] 
                })
            })
            .catch(error => {
                console.error(error);
            })
    }

    componentDidUpdate() {
        axios.get("http://localhost:8080/api/user/polls", { withCredentials: true }, {username: this.state.username})
        .then(res => {
            if (res.data.polls) {
                    this.setState({
                         userPolls: [...res.data.polls]
                    });  
            }

        })
        .catch(error => {
            console.error(error);
        })
    }

    handlePollDeletion(e){
        axios.delete(`http://localhost:8080/api/polls/${e.target.id}`, { withCredentials: true })
            .then(res => {
                    this.setState({
                        showDeletionMessage: true
                    })
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        return(
            <div>
                {this.state.showDeletionMessage ? <span>The poll has been successfully deleted!</span> : ""}
                {this.state.userPolls.map(poll => 
                <div key={poll._id}>
                    <h2>{poll.name}</h2>
                    <p>Votes: {poll.votes}</p>
                    <button id={poll._id} onClick={this.handlePollDeletion}>Delete</button>
                </div>)}
            </div>
        );
    }
}

export default UserPolls;