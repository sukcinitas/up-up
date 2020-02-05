import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

class UserPolls extends React.Component {
    constructor() {
        super();
        this.state = {
            userPolls: []
        }
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
        this.getUserPolls = this.getUserPolls.bind(this);
    }

    componentDidMount(){
        this.getUserPolls();
    }

    getUserPolls() {
        axios.get(`http://localhost:8080/api/user/polls/${this.props.username}`)
            .then(res => {
                if (res.data.polls) {
                    this.setState({
                        userPolls: [...res.data.polls]
                    });  
                };
            })
            .catch(error => {
                console.error(error);
            }); 
    } 

    handlePollDeletion(e){
        axios.delete(`http://localhost:8080/api/polls/${e.target.id}`)
            .then(() => {
                    this.getUserPolls();
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        return(
            <div>
                {
                    this.state.userPolls.length === 0
                    ?
                    <p>You have no polls created!</p>
                    :
                    this.state.userPolls.map(poll => 
                    <div key={poll._id}>
                        <h3>{poll.name}</h3>
                        <p>{poll.votes} {poll.votes === 1 ? "vote" : "votes"}</p>
                        <button id={poll._id} onClick={this.handlePollDeletion}>Delete</button>
                    </div>)
                }
            </div>
        );
    }
}

export default UserPolls;