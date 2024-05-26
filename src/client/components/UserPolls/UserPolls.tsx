import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import DeleteButton from '../DeleteButton/DeleteButton';
import Loader from '../Loader/Loader';
import '../../sass/UserPolls.scss';

axios.defaults.withCredentials = true;

type TPoll = {
  name: string;
  votes: number;
  id: string;
};

const UserPolls = ({ username }: { username: string }) => {
  const [userPolls, setUserPolls] = useState<TPoll[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserPolls = () => {
      setIsLoading(true);
      axios.get(`/api/polls/user/${username}`).then(
        (res) => {
          if (res.data.success) {
            setUserPolls([...res.data.polls]);
            setIsLoading(false);
          }
        },
        (err) => {
          setErrorMessage(
            err.response.data.message ||
              `${err.response.status}: ${err.response.statusText}`,
          );
          setIsLoading(false);
        },
      );
    };
    getUserPolls();
  }, [username]);

  const handlePollDeletion = (id: string): void => {
    axios.delete(`/api/polls/${id}`).then(
      (res) => {
        if (res.data.success) {
          setUserPolls(
            userPolls.filter(
              (poll: TPoll): boolean => poll.id !== id,
            ),
          );
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

  const polls = userPolls.map(
    (poll: TPoll): JSX.Element => (
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
        <DeleteButton
          id={poll.id}
          callback={() => handlePollDeletion(poll.id)}
        />
      </div>
    ),
  );
  return (
    <section className="user-polls">
      <h2 className="heading user-polls__heading">Polls</h2>
      <Link to="/user/create-poll" className="btn btn--create">
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
