import React from "react";

//only shown then logged in, then instead of login/register => logout, changes global state
//shows polls user have created with delete buttons
//shows settings => change details
//shows poll creation link

class UserPolls extends React.Component {
    constructor(props) {
        super();
        this.state = {
            userPolls: [],
            username: "",
            email: "",
            password: "",
            id: ""
        }
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
    }

    componentDidMount(){
        axios.get("http://localhost:8080/profile")
            .then(res => {
                this.setState({
                    polls: [...res.data]
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handlePollDeletion(){
        axios.delete(`http://localhost:8080/polls/${this.state.id}`)
            .then(res => {
                    this.setState({
                        redirect: res.data.redirect,
                    })
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return(
            <div>
                {userPolls.map(poll => 
                <div key={poll.id}>
                    <h2>{poll.name}</h2>
                    <p>Votes: {poll.votes}</p>
                    <button onClick={this.handlePollDeletion}>Delete</button>
                </div>)}
            </div>
        );
    }
}

export default UserPolls;