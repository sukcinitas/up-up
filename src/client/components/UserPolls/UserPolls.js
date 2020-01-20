import React from "react";

//only shown then logged in, then instead of login/register => logout, changes global state
//shows polls user have created with delete buttons
//shows settings => change details
//shows poll creation link

class UserPolls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            username: "username",
            showDeletionMessage: false
        }
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
    }
//username must be global, from login
    componentDidMount(){
        axios.get("http://localhost:8080/api/user/polls", {username: this.state.username})
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
        axios.get("http://localhost:8080/api/user/polls", {username: this.state.username})
        .then(res => {
            this.setState({
                userPolls: [...res.data.polls]
            })
        })
        .catch(error => {
            console.error(error);
        })
    }

    handlePollDeletion(e){
        axios.delete(`http://localhost:8080/api/polls/${e.target.id}`)
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
                {userPolls.map(poll => 
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