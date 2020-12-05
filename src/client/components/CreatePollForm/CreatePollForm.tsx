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
  list:Array<{id:number, value:string}>,
  counter:number,
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
      list: [{ id: 1, value: '' }, { id: 2, value: '' }],
      counter: 2,
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

  handleOptionsChange(idx:number, e:React.ChangeEvent<HTMLInputElement>) {
    const { list } = this.state;
    const i = list.findIndex((item) => item.id === idx);
    list[i].value = e.target.value;
    this.setState({
      list,
    });
  }

  handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const { history, username } = this.props;
    const {
      name, question, list,
    } = this.state;
    if (!name || !question || list.some((item) => item.value === '') || list.length < 2) {
      this.setState({
        errorMessage: 'Poll name, question/statement and at least two options are required for submission! All fields must be filled in!',
      });
      return;
    }
    const compareList = list.map((item) => item.value);
    if ((new Set(compareList)).size !== list.length) {
      this.setState({
        errorMessage: 'Poll options must be unique!',
      });
      return;
    }
    const optionsList:Array<{ option: string, votes: number }> = [];
    list.forEach((item, i) => {
      if (this.state.list[i].value === '') {
        return;
      }
      optionsList.push({ option: item.value, votes: 0 });
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
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  addOption(e:React.MouseEvent<HTMLButtonElement>):void {
    e.preventDefault();
    this.setState((prevState) => ({
      counter: prevState.counter + 1,
      list: [...prevState.list, { id: prevState.counter + 1, value: '' }],
    }));
  }

  removeOption(idx:number):void {
    const newList = this.state.list.filter((item) => item.id !== idx);
    this.setState(() => ({
      list: newList,
    }));
  }

  render() {
    const {
      name, question, list, errorMessage,
    } = this.state;
    const optionsList = list.map((item) => (
      <div className="wrapper">
        <input
          key={item.id}
          aria-label={`${item.id}`}
          className="form__input form__input--poll-form"
          type="text"
          name={`${item.id}`}
          onChange={(e) => this.handleOptionsChange(item.id, e)}
          value={item.value || ''}
        />
        <button
          type="button"
          onClick={() => this.removeOption(item.id)}
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
