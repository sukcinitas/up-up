import React from "react";
import PollListElem from "./PollListElem/PollListElem";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PollList.css";

const mockPollList=[
    {
        _id: 1,
        name: "What's God gender?",
        votes: 0,
        created_by: "username1",
        createdAt: "2012-10-12"
    },
    {
        _id: 2,
        name: "What's God gender?",
        votes: 0,
        created_by: "username2",
        createdAt: "2012-10-12"
    },
    {
        _id: 3,
        name: "What's God gender?",
        votes: 0,
        created_by: "username3",
        createdAt: "2012-10-12"
    },
]

class PollList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: [...mockPollList]
        }
    }
    componentDidMount(){
        axios.get("http://localhost:8080/polls")
            .then(res => {
                this.setState({
                    polls: [...res.data]
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    render() {
        const list = this.state.polls.map(poll => {
            return  <div key={poll._id}> 
                        <PollListElem
                            name={poll.name} 
                            votes={poll.votes} 
                            created_by={poll.created_by}
                            createdAt={poll.createdAt}
                            _id={poll._id}
                        />
                    </div>
        })
        return (
            <div className="poll-list">
                {list}
                <Link to="user/create-poll">Create a poll</Link>
            </div>
        ) 
    }
}

export default PollList;