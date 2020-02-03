import React from "react";
import axios from "axios";
import formatDate from "../../util/formatDate";
import { connect } from "react-redux";
import BarChart from "../BarChart/BarChart";

class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            poll: {
                name: "",
                question: "",
                options: [],
                votes: 0,
                created_by: "",
                createdAt: ""
            },
            hasVoted: false, 
            message: ""
        }
        this.handleVote = this.handleVote.bind(this);
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
    }
    componentDidMount(){
        axios.get(`http://localhost:8080/api/polls/${this.props.match.params.id}`, { withCredentials: true })
            .then(res => {                
                const { poll } = res.data;
                this.setState({
                    poll
                });
            });
    }

    handleVote(e){
        if (this.state.hasVoted) {
            return;
        }; //initial dealing with only letting one vote per user
        axios(`http://localhost:8080/api/polls/${this.props.match.params.id}`, 
            { 
                method: "put",
                withCredentials: true,
                data: { option: e.target.dataset.option,
                        options: this.state.poll.options,
                        votes: this.state.poll.votes}
            })
                .then(res => {
                    this.setState({
                        hasVoted: true, 
                        message: "Your vote has been successfully submitted!" 
                    }, () => {
                        this.setState({
                            poll: res.data.poll
                        });
                    });
                })
                .catch(error => {
                    console.log(error);
                });
    }
    //only accessible to user
    handlePollDeletion(){
        axios.delete(`http://localhost:8080/api/polls/${this.props.match.params.id}`, { withCredentials: true })
            .then(res => {
                    this.setState({
                        redirect: res.data.redirect,
                    }, () => {
                        this.props.history.push("/"); 
                    });

            })
            .catch(error => {
                console.log(error);
            })
    }

    render(){
        const {name, question, options, votes, created_by, createdAt} = this.state.poll;
        const data = {
            optionsList: Object.keys(options).map(option => ({ option, votes: options[option]})),
            sumVotes: votes 
        }
        return (
            <div>
                {this.state.message ? <span>{this.state.message}</span> : ""}
                <h2>{name}</h2>
                <div>
                    <h3>{question}</h3>
                    <BarChart data={data}/>
                    {Object.keys(options).map(option => {
                        return (<div key={option}>
                                    <button data-option={option} onClick={this.handleVote}>{option}</button>
                                    <small>{options[option]}</small>
                                </div>);
                    })}
                    <p>{votes}</p>
                    <p>{created_by}</p>
                    <p>{formatDate(createdAt)}</p>
                </div>
                {this.props.username === created_by ? <button onClick={this.handlePollDeletion}>Delete</button> : ""}
            </div>
        )   
    } 
}

const mapStateToProps = state => ({
    username: state.username
});

export default connect(mapStateToProps)(Poll);