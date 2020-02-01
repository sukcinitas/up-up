import React from "react";
import PollListElem from "./PollListElem/PollListElem";
import { Link } from "react-router-dom";
import axios from "axios";
import "./PollList.css";
import formatDate from "../../util/formatDate";


class PollList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: []
        }
    }
    componentDidMount(){
        axios.get("http://localhost:8080/api/polls", { withCredentials: true })
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
                            updatedAt={formatDate(poll.updatedAt)}
                            _id={poll._id}
                        />
                    </div>
        })
        return (
            <div className="poll-list">
                {list}
                <Link to="/user/create-poll">Create a poll</Link>
            </div>
        ) 
    }
}

export default PollList;