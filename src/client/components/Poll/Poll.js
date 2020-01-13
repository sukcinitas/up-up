import React from "react";
import axios from "axios";

class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            question: "",
            options: {},
            votes: 0,
            created_by: "",
            createdAt: ""
        }
        this.handleVote = this.handleVote.bind(this);
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
    }
    componentDidMount(){
        axios.get(`http://localhost:8080/poll/${this.props.match.params.id}`)
            .then(res => {
                const {name, question, options, votes, created_by, createdAt} = res.data;
                this.setState({
                    name,
                    question,
                    options,
                    votes,
                    created_by,
                    createdAt
                })
            })
    }
    handleVote(e){
        console.log(e.target.dataset.option)
        axios.put(`http://localhost:8080/poll/${this.props.match.params.id}`, 
                {option: e.target.dataset.option,
                options: this.state.options,
                votes: this.state.votes})
                .then(res => {
                    if (res.data.redirect) {
                        window.location.reload; 
                    }
                })
                .catch(error => {
                    console.log(error);
                })
    }
    handlePollDeletion(){
        axios.delete(`http://localhost:8080/poll/${this.props.match.params.id}`)
            .then(res => {
                if (res.data.redirect) {
                    window.location.href = "/"; // the way to redirect on client side as server does not work in axios????
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
    render(){
        const {name, question, options, votes, created_by, createdAt} = this.state;
        return (
            <div>
                <h2>{name}</h2>
                <div>
                    <h3>{question}</h3>
                    {Object.keys(options).map(option => {
                        return (<div key={option}>
                                    <button data-option={option} onClick={this.handleVote}>{option}</button>
                                    <small>{options[option]}</small>
                                </div>)
                    })}
                    <p>{votes}</p>
                    <p>{created_by}</p>
                    <p>{createdAt}</p>
                </div>
                <button onClick={this.handlePollDeletion}>Delete</button>
            </div>
        )   
    } 
}

export default Poll;