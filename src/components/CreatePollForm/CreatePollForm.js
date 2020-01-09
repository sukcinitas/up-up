//finish handleSubmit to get to PollList page with this new poll inserted
import React from "react";

class CreatePollForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            question: "",
            optionCount: 2,
            options: [1, 2],
            option_1: "",
            option_2: ""
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
        console.log(this.state);
    }
    addOption(e){
        const optionName = `option_${this.state.optionCount + 1}`;
        this.setState((prevState) => ({
            optionCount: prevState.optionCount + 1,
            options: [...prevState.options, prevState.optionCount + 1],
            [optionName]: "" 
        }))
        e.preventDefault();
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