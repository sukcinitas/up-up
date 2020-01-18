import React from "react";
import axios from "axios";
import { Redirect } from "react-router";

class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            question: "",
            options: {},
            votes: 0,
            created_by: "",
            createdAt: "",
            redirect: false,
            vote: false,
            id: this.props.match.params.id
        }
        this.handleVote = this.handleVote.bind(this);
        this.handlePollDeletion = this.handlePollDeletion.bind(this);
    }
    componentDidMount(){
        axios.get(`http://localhost:8080/polls/${this.state.id}`)
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
    componentDidUpdate(){
        axios.get(`http://localhost:8080/polls/${this.state.id}`)
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
        axios.put(`http://localhost:8080/polls/${this.state.id}`, 
                {option: e.target.dataset.option,
                options: this.state.options,
                votes: this.state.votes})
                .then(res => {
                    this.setState({
                        vote: true 
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
    renderRedirect(){
        if (this.state.redirect) {
            return <Redirect to="/"/>  
        }
    }

    render(){
        const {name, question, options, votes, created_by, createdAt} = this.state;
        return (
            <div>
                {this.renderRedirect()}
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