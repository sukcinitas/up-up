import React from "react";
import axios from "axios";

class UserPolls extends React.Component {
    constructor() {
        super();
        this.state = {
            showDeletionMessage: false,
            userPolls: []
        }
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
        this.getUserPolls = this.getUserPolls.bind(this);
    }

    componentDidMount(){
        this.getUserPolls();
    }

    getUserPolls() {
        axios.get(`http://localhost:8080/api/user/polls/${this.props.username}`, { withCredentials: true })
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
                    this.getUserPolls();
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