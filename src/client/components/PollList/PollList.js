import React from "react";
import PollListElem from "./PollListElem/PollListElem";
import axios from "axios";
axios.defaults.withCredentials = true;
import "./PollList.css";
import formatDate from "../../util/formatDate";
import { connect } from "react-redux";
import { Link } from "react-router-dom";


class PollList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: []
        }
    }
    componentDidMount(){
        axios.get("http://localhost:8080/api/polls")
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
                            created_by={this.props.username === poll.created_by ? "you" : poll.created_by}
                            updatedAt={formatDate(poll.updatedAt)}
                            _id={poll._id}
                        />
                    </div>
        })
        return (
            <div className="poll-list">
                {list}
                {this.props.username ? <Link to="/user/create-poll">Create a poll</Link> : ""}
            </div>
        ) 
    }
}

const mapStateToProps = state => ({
    username: state.username
});

export default connect(mapStateToProps)(PollList);