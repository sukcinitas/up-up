
import React from "react";
import axios from "axios";

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
            created_by: "username"
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
        // const options = this.state.options.map(option => {
        //     return  {[this.state[`option_${option}`]]: 0}
        // });
        const options = {};
        this.state.options.map(option => {
            options[this.state[`option_${option}`]] = 0;
        })
        const poll = {
            options,
            name: this.state.name,
            question: this.state.question,
            created_by: this.state.created_by
        }
        axios.post("http://localhost:8080/create-poll", poll)
            .then(res => {
                if (res.data.redirect) {
                    window.location.href = "/";
                }
            })
            .catch(error => {
                console.log(error);
            })
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
            return  <div key={`option_${item}`}>
                        <input type="text" name={`option_${item}`} onChange={this.handleChange} value={this.state[`option_${item}`]}></input>
                    </div> 
        });
        return (
            <form>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" onChange={this.handleChange} value={this.state.name}></input>
                <label htmlFor="question">Question/statement</label>
                <input type="text" name="question" onChange={this.handleChange} value={this.state.question}></input>
                <div id="options">
                    {options}
                </div>
                <button onClick={this.addOption}>Add another option</button>
                <button type="submit" onClick={this.handleSubmit}>Submit</button>
            </form>
        )
    }
}

export default CreatePollForm;