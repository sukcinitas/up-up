/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { AppState } from '../../redux/actions';

axios.defaults.withCredentials = true;

interface ICreatePollFormStateProps {
  username: string,
}
interface CreatePollFormRouteProps extends RouteComponentProps {};
type AllProps = CreatePollFormRouteProps & AppState;

interface ICreatePollFormState {
  name:string,
  question:string,
  optionCount:number,
  options:Array<number>,
  option1:string,
  option2:string,
  errorMessage:string,
  [index: string]:any, /// ?
};

class CreatePollForm extends React.Component<AllProps, ICreatePollFormState> {
  static propTypes: { history: any; username: PropTypes.Validator<string>; };
  constructor(props:AllProps) {
    super(props);
    this.state = {
      name: '',
      question: '',
      optionCount: 2,
      options: [1, 2],
      option1: '',
      option2: '',
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addOption = this.addOption.bind(this);
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { history, username } = this.props;
    const {
      options, name, question, option1, option2,
    } = this.state;
    if (!name || !question || !option1 || !option2) {
      this.setState({
        errorMessage: 'Poll name, question/statement and at least two options are required for submission!',
      });
      return;
    }
    const optionsList:{[index: string]:number} = {};
    options.forEach((option) => {
      if (this.state[`option${option}`] === '') {
        return;
      }
      optionsList[this.state[`option${option}`]] = 0;
    });
    const poll = {
      name,
      question,
      options: optionsList,
      createdBy: username,
    };
    axios.post('http://localhost:8080/api/user/create-poll', poll)
      .then((res) => {
        if (res.data.redirect) {
          history.push(`/polls/${res.data.id}`);
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.response.data,
        });
      });
  }

  addOption(e:React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { optionCount } = this.state;
    const optionName = `option${optionCount + 1}`;
    this.setState((prevState) => ({
      optionCount: prevState.optionCount + 1,
      options: [...prevState.options, prevState.optionCount + 1],
      [optionName]: '',
    }));
  }

  render() {
    const {
      name, question, options, errorMessage,
    } = this.state;
    const optionsList = options.map((item) => (
      <input
        key={`option${item}`}
        aria-label={`option${item}`}
        className="form__input"
        type="text"
        name={`option${item}`}
        onChange={this.handleChange}
        value={this.state[`option${item}`]}
      />
    ));
    return (
      <form className="form create-poll-form">

        <h1 className="heading">Create a Poll</h1>

        <label
          className="form__label"
          htmlFor="name"
        >
          Poll name
        </label>
        <input
          className="form__input"
          type="text"
          id="name"
          name="name"
          onChange={this.handleChange}
          value={name}
        />

        <label
          className="form__label"
          htmlFor="question"
        >
          Poll question/statement
        </label>
        <input
          className="form__input"
          type="text"
          id="question"
          name="question"
          onChange={this.handleChange}
          value={question}
        />

        <label className="form__label" htmlFor="answers">Poll options</label>
        <div id="options">
          {optionsList}
        </div>

        <button type="button" onClick={this.addOption} className="btn btn--plus"> + </button>
        <button type="submit" onClick={this.handleSubmit} className="btn btn--submit">Submit</button>

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </form>
    );
  }
}

const mapStateToProps = (state:AppState) => ({
  username: state.username,
});

export default connect(mapStateToProps)(CreatePollForm);
