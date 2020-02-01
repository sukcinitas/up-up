import React from "react";
import axios from "axios";
import "./CreatePollForm.css";
import { connect } from "react-redux";

class CreatePollForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            question: "",
            optionCount: 2,
            options: [1, 2],
            option_1: "",
            option_2: "",
        }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addOption = this.addOption.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        const options = {};
        this.state.options.map(option => {
            if (this.state[`option_${option}`] === "") {
                return;
            }
            options[this.state[`option_${option}`]] = 0;
        })
        const poll = {
            options,
            name: this.state.name,
            question: this.state.question,
            created_by: this.props.username
        }
        axios("http://localhost:8080/api/user/create-poll", 
        {   
            method: "post",
            data: poll, 
            withCredentials: true 
        })
            .then(res => {
                if (res.data.redirect) {
                     this.props.history.push(`/polls/${res.data.id}`);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    addOption(e){
        e.preventDefault();
        const optionName = `option_${this.state.optionCount + 1}`;
        this.setState((prevState) => ({
            optionCount: prevState.optionCount + 1,
            options: [...prevState.options, prevState.optionCount + 1],
            [optionName]: "" 
        }))
    } 
    
    render() {
        const options = this.state.options.map((item)=> {
            return  <input key={`option_${item}`} className="input--poll" type="text" name={`option_${item}`} onChange={this.handleChange} value={this.state[`option_${item}`]}></input>

        });
        return (
                <form className="form--poll">

                    <h1 className="header1">Create</h1>
                    <h1 className="header2">Poll</h1>

                    <label className="label--poll" htmlFor="name">Poll name</label>
                    <input className="input--poll" type="text" name="name" onChange={this.handleChange} value={this.state.name}></input>

                    <label className="label--poll" htmlFor="question">Poll question/statement</label>
                    <input className="input--poll" type="text" name="question" onChange={this.handleChange} value={this.state.question}></input>

                    <label className="label--poll" htmlFor="answers">Poll answers</label>
                    <div id="options" name="answers">
                        {options} 
                    </div>

                    <button onClick={this.addOption}>Add another option</button>
                    <button type="submit" onClick={this.handleSubmit}>Submit</button>
                </form>
        )
    }
}

const mapStateToProps = state => ({
    username: state.username
});

export default connect(mapStateToProps)(CreatePollForm);