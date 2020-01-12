import React from "react";
import axios from "axios";

class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            question: "",
            options: [],
            votes: 0,
            created_by: "",
            createdAt: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
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
    handleSubmit(){
        // 
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
                    {options.map(option => (
                    <button key={option.option+name} onClick={this.handleSubmit}>{option.option}</button>
                    ))}
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