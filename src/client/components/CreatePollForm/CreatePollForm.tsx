/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { connect } from 'react-redux';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { AppState } from '../../redux/actions';

axios.defaults.withCredentials = true;

interface ICreatePollFormStateProps {
  username: string,
}
interface CreatePollFormRouteProps extends RouteComponentProps {}
type AllProps = CreatePollFormRouteProps & ICreatePollFormStateProps;

interface ICreatePollFormState {
  name:string,
  question:string,
  values:Array<string>,
  errorMessage:string,
  [index: string]:any,
}

class CreatePollForm extends React.Component<AllProps, ICreatePollFormState> {
  static propTypes: { history: any; username: PropTypes.Validator<string>; };

  constructor(props:AllProps) {
    super(props);
    this.state = {
      name: '',
      question: '',
      values: ['', ''],
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOptionsChange = this.handleOptionsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addOption = this.addOption.bind(this);
    this.removeOption = this.removeOption.bind(this);
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleOptionsChange(idx, e:React.ChangeEvent<HTMLInputElement>) {
    const { values } = this.state;
    values[idx] = e.target.value;
    this.setState({
      values,
    });
  }

  handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { history, username } = this.props;
    const {
      name, question, values,
    } = this.state;
    if (!name || !question || values.some((value) => value === '') || values.length < 2) {
      this.setState({
        errorMessage: 'Poll name, question/statement and at least two options are required for submission! All fields must be filled in!',
      });
      return;
    }
    if ((new Set(values)).size !== values.length) {
      this.setState({
        errorMessage: 'Poll options must be unique!',
      });
      return;
    }
    const optionsList:{[index: string]:number} = {};
    values.forEach((value, i) => {
      if (this.state.values[i] === '') {
        return;
      }
      optionsList[value] = 0;
    });
    const poll = {
      name,
      question,
      options: optionsList,
      createdBy: username,
    };
    axios.post('/api/polls/create-poll', poll)
      .then((res) => {
        if (res.data.success) {
          history.push(`/polls/${res.data.id}`);
        } else {
          this.setState({
            errorMessage: res.data.message,
          });
        }
      });
  }

  addOption(e:React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    this.setState((prevState) => ({
      values: [...prevState.values, ''],
    }));
  }

  removeOption(idx) {
    this.setState((prevState) => ({
      values: [...prevState.values.slice(0, idx), ...prevState.values.slice(idx + 1)],
    }));
  }

  render() {
    const {
      name, question, values, errorMessage,
    } = this.state;
    const optionsList = values.map((item, idx) => (
      <div className="wrapper">
        <input
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          aria-label={`${idx}`}
          className="form__input form__input--poll-form"
          type="text"
          name={`${idx}`}
          onChange={(e) => this.handleOptionsChange(idx, e)}
          value={item || ''}
        />
        <button
          type="button"
          onClick={() => this.removeOption(idx)}
          className="form__minus"
        >
          <FontAwesomeIcon icon={['fas', 'minus']} />
        </button>
      </div>
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
        {optionsList}

        <button type="button" onClick={this.addOption} className="btn btn--plus" data-testid="plus">
          <FontAwesomeIcon icon={['fas', 'plus']} />
        </button>
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
