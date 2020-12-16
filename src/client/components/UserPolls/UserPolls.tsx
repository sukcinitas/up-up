/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import '../../sass/UserPolls.scss';

axios.defaults.withCredentials = true;

interface IUserPollsProps {
  username: string;
}

const UserPolls: React.FunctionComponent<IUserPollsProps> = ({
  username,
}) => {
  const [userPolls, setUserPolls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserPolls = (): void => {
      setIsLoading(true);
      axios
        .get(`/api/polls/user/${username}`)
        .then((res) => {
          if (res.data.success) {
            setUserPolls([...res.data.polls]);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setErrorMessage(
            err.response.data.message ||
              `${err.response.status}: ${err.response.statusText}`,
          );
          setIsLoading(false);
        });
    };
    getUserPolls();
  }, []);

  const handlePollDeletion = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    const { id } = e.currentTarget;
    axios
      .delete(`/api/polls/${id}`)
      .then((res) => {
        if (res.data.success) {
          setUserPolls(userPolls.filter((poll) => poll.id !== id));
        }
      })
      .catch((err) => {
        setErrorMessage(
          err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        );
      });
  };

  const polls = userPolls.map(
    (poll: { id: string; name: string; votes: number }) => (
      <div
        key={poll.id}
        data-testid={`div${poll.id}`}
        className="user-polls__poll"
      >
        <Link to={`/polls/${poll.id}`} className="user-polls__title">
          {poll.name}
        </Link>
        <p className="user-polls__votes">
          {poll.votes === 1
            ? `${poll.votes} vote`
            : `${poll.votes} votes`}
        </p>
        <button
          data-testid={poll.id}
          type="button"
          id={poll.id}
          onClick={handlePollDeletion}
          className="btn btn--delete user-polls__btn"
        >
          Delete
        </button>
      </div>
    ),
  );
  return (
    <section className="user-polls">
      <h2 className="heading user-polls__heading">Polls</h2>
      <Link
        to="/user/create-poll"
        className="user-polls__btn--create"
      >
        Create a poll
      </Link>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {isLoading ? (
        <Loader size="big" />
      ) : userPolls.length === 0 && !errorMessage ? (
        <p className="user-polls__notes">
          You have not created any polls yet!
        </p>
      ) : (
        <div className="user-polls__polls">{polls}</div>
      )}
    </section>
  );
};

UserPolls.propTypes = {
  username: PropTypes.string.isRequired,
};

export default UserPolls;
