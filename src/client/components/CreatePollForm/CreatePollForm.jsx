/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import './CreatePollForm.css';

axios.defaults.withCredentials = true;

class CreatePollForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      question: '',
      optionCount: 2,
      options: [1, 2],
      option_1: '',
      option_2: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addOption = this.addOption.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { history, username } = this.props;
    const { options, name, question } = this.state;
    const optionsList = {};
    options.forEach((option) => {
      if (this.state[`option_${option}`] === '') {
        return;
      }
      options[this.state[`option_${option}`]] = 0;
    });
    const poll = {
      name,
      question,
      options: optionsList,
      createdBy: username,
    };
    axios('http://localhost:8080/api/user/create-poll',
      {
        method: 'post',
        data: poll,
      })
      .then((res) => {
        if (res.data.redirect) {
          history.push(`/polls/${res.data.id}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addOption(e) {
    e.preventDefault();
    const { optionCount } = this.state;
    const optionName = `option_${optionCount + 1}`;
    this.setState((prevState) => ({
      optionCount: prevState.optionCount + 1,
      options: [...prevState.options, prevState.optionCount + 1],
      [optionName]: '',
    }));
  }

  render() {
    const { name, question, options } = this.state;
    const optionsList = options.map((item) => <input key={`option_${item}`} className="input--poll" type="text" name={`option_${item}`} onChange={this.handleChange} value={this.state[`option_${item}`]} />);
    return (
      <form className="form--poll">

        <h1 className="header1">Create</h1>
        <h1 className="header2">Poll</h1>

        <label className="label--poll" htmlFor="name">
          Poll name
          <input className="input--poll" type="text" name="name" onChange={this.handleChange} value={name} />
        </label>

        <label className="label--poll" htmlFor="question">
          Poll question/statement
          <input className="input--poll" type="text" name="question" onChange={this.handleChange} value={question} />
        </label>

        <label className="label--poll" htmlFor="answers">
          Poll answers
          <div id="options" name="answers">
            {optionsList}
          </div>
        </label>

        <button type="button" onClick={this.addOption}>Add another option</button>
        <button type="submit" onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

CreatePollForm.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.username,
});

export default connect(mapStateToProps)(CreatePollForm);
