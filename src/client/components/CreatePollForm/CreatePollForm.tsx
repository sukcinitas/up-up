import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import { RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { AppState } from '../../redux/actions';

axios.defaults.withCredentials = true;

const CreatePollForm = ({ history }: RouteComponentProps) => {
  const { username } = useSelector((state: AppState) => ({
    username: state.username,
  }));
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [list, setList] = useState([
    { id: 1, value: '' },
    { id: 2, value: '' },
  ]);
  const [counter, setCounter] = useState(2);
  const [errorMessage, setErrorMessage] = useState('');

  const handleOptionsChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newList = [...list];
    const i = newList.findIndex((item) => item.id === idx);
    newList[i].value = e.target.value;
    setList(newList);
  };

  const addOption = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    const count = counter + 1;
    setCounter(count);
    setList([...list, { id: count, value: '' }]);
  };

  const removeOption = (idx: number): void => {
    const newList = list.filter((item) => item.id !== idx);
    setList(newList);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !name ||
      !question ||
      list.some((item) => item.value === '') ||
      list.length < 2
    ) {
      setErrorMessage(
        'Poll name, question/statement and at least two options are required for submission! All fields must be filled in!',
      );
      return;
    }
    const compareList = list.map((item) => item.value);
    if (new Set(compareList).size !== list.length) {
      setErrorMessage('Poll options must be unique!');
      return;
    }
    const optionsList: Array<{ option: string; votes: number }> = [];
    list.forEach((item, i) => {
      if (list[i].value === '') {
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
    axios.post('/api/polls/create-poll', poll).then(
      (res) => {
        if (res.data.success) {
          history.push(`/polls/${res.data.id}`);
        }
      },
      (err) => {
        setErrorMessage(
          err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        );
      },
    );
  };

  const optionsList = list.map((item) => (
    <div className="wrapper" key={item.id}>
      <input
        aria-label={`${item.id}`}
        className="form__input form__input--poll-form"
        type="text"
        name={`${item.id}`}
        onChange={(e) => handleOptionsChange(item.id, e)}
        value={item.value}
      />
      <button
        type="button"
        onClick={() => removeOption(item.id)}
        className="form__minus"
      >
        <FontAwesomeIcon icon={['fas', 'minus']} />
      </button>
    </div>
  ));
  return (
    <form className="form create-poll-form">
      <h1 className="heading">Create a Poll</h1>

      <label className="form__label" htmlFor="name">
        Poll name
      </label>
      <input
        className="form__input"
        type="text"
        id="name"
        name="name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label className="form__label" htmlFor="question">
        Poll question/statement
      </label>
      <input
        className="form__input"
        type="text"
        id="question"
        name="question"
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
      />

      <label className="form__label" htmlFor="answers">
        Poll options
      </label>
      {optionsList}

      <button
        type="button"
        onClick={addOption}
        className="btn btn--plus"
        data-testid="plus"
      >
        <FontAwesomeIcon icon={['fas', 'plus']} />
      </button>
      <button
        type="submit"
        onClick={handleSubmit}
        className="btn btn--submit"
      >
        Submit
      </button>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </form>
  );
};

CreatePollForm.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};

export default CreatePollForm;
