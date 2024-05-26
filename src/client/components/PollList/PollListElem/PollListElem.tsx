import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { fetchStarredPolls } from '../../../store/reducers/usersSlice';
import '../../../sass/PollListElem.scss';
import { AppDispatch, RootState } from '../../../store';

axios.defaults.withCredentials = true;

type TPollListElemProps = {
  id: string;
  name: string;
  votes: number;
  createdBy: string;
  updatedAt: string;
  starred: boolean;
  link: (id: string) => void;
};

const PollListElem = ({
  id,
  name,
  votes,
  createdBy,
  updatedAt,
  starred,
  link,
}: TPollListElemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((state: RootState) => state.users.username);
  const userId = useSelector((state: RootState) => state.users.userId);
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
            dispatch(fetchStarredPolls(username));
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
            dispatch(fetchStarredPolls(username));
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
      onClick={(): void => link(id)}
      onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter') {
          link(id);
        }
      }}
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
              ? (e: React.MouseEvent<HTMLButtonElement>) =>
                  unStarAPoll(id, e)
              : (e: React.MouseEvent<HTMLButtonElement>) =>
                  starAPoll(id, e)
          }
        >
          {starred ? (
            <FontAwesomeIcon icon={solidStar} />
          ) : (
            <FontAwesomeIcon icon={faStar} />
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
