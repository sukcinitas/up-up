/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppState,
  getStarredPollsAsync,
} from '../../../redux/actions';
import '../../../sass/PollListElem.scss';

axios.defaults.withCredentials = true;

interface IPollListElemProps {
  id: string;
  name: string;
  votes: number;
  createdBy: string;
  updatedAt: string;
  starred: boolean;
  link: Function;
}

const PollListElem: React.FunctionComponent<IPollListElemProps> = ({
  id,
  name,
  votes,
  createdBy,
  updatedAt,
  starred,
  link,
}) => {
  const dispatch = useDispatch();
  const { username } = useSelector((state: AppState) => ({
    username: state.username,
  }));
  const { userId } = useSelector((state: AppState) => ({
    userId: state.userId,
  }));
  const [errorMessage, setErrorMessage] = useState('');

  const starAPoll = (
    pollId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.stopPropagation();
    axios
      .put('/api/user/star-poll', {
        id: userId,
        pollId,
      })
      .then(
        (res) => {
          if (res.data.success) {
            dispatch(getStarredPollsAsync(username));
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

  const unStarAPoll = (
    pollId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.stopPropagation();
    axios
      .put('/api/user/unstar-poll', {
        id: userId,
        pollId,
      })
      .then(
        (res) => {
          if (res.data.success) {
            dispatch(getStarredPollsAsync(username));
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

  return (
    <div
      role="button"
      tabIndex={0}
      className="poll-list-elem"
      onClick={() => link(id)}
    >
      <div className="poll-list-elem__heading">
        <h2>{name}</h2>
      </div>
      <div className="poll-list-elem__details">
        <p className="poll-list-elem__created-by">
          created by
          <span>{` ${createdBy}`}</span>
        </p>
        <p className="poll-list-elem__votes">
          <span>{votes}</span>
          {votes === 1 ? ' vote' : ' votes'}
        </p>
        <p className="poll-list-elem__updated-at">
          last updated on
          {` ${updatedAt}`}
        </p>
      </div>
      {userId && (
        <button
          type="button"
          className={`poll-list-elem__star ${
            starred ? 'poll-list-elem__star--starred' : ''
          }`}
          onClick={
            starred
              ? (e) => unStarAPoll(id, e)
              : (e) => starAPoll(id, e)
          }
        >
          {starred ? (
            <FontAwesomeIcon icon={['fas', 'star']} />
          ) : (
            <FontAwesomeIcon icon={['far', 'star']} />
          )}
        </button>
      )}
      <span>{errorMessage}</span>
    </div>
  );
};

PollListElem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  createdBy: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  starred: PropTypes.bool.isRequired,
  link: PropTypes.func.isRequired,
};

export default PollListElem;
