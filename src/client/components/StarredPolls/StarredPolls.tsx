import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { fetchStarredPolls } from '../../store/reducers/usersSlice';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import '../../sass/UserPolls.scss';
import { AppDispatch, RootState } from '../../store';

axios.defaults.withCredentials = true;

const StarredPolls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((state: RootState) => state.users.username);
  const userId = useSelector((state: RootState) => state.users.userId);
  const starredPollsIds = useSelector((state: RootState) => state.users.starredPolls);
  const [starredPolls, setStarredPolls] = useState<
    {
      _id: string;
      name: string;
      votes: number;
    }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getStarredPolls = (): void => {
      setIsLoading(true);
      axios
        .post('/api/polls/starred', { listOfIds: starredPollsIds })
        .then(
          (res) => {
            if (res.data.success) {
              setIsLoading(false);
              setStarredPolls([...res.data.polls]);
            }
          },
          (err) => {
            setIsLoading(false);
            setErrorMessage(
              err.response.data.message ||
                `${err.response.status}: ${err.response.statusText}`,
            );
          },
        );
    };
    getStarredPolls();
  }, [starredPollsIds]);

  const unStarAPoll = (pollId: string): void => {
    axios
      .put('/api/user/unstar-poll', {
        id: userId,
        pollId,
      })
      .then(
        (res) => {
          if (res.data.success) {
            dispatch(fetchStarredPolls(username));
            setStarredPolls(
              starredPolls.filter((poll) => poll._id !== pollId),
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

  const polls = starredPolls.map(
    (poll: { _id: string; name: string; votes: number }) => (
      <div key={`${poll._id}-starred`} className="user-polls__poll">
        <Link to={`/polls/${poll._id}`} className="user-polls__title">
          {poll.name}
        </Link>
        <button
          type="button"
          className="user-polls__star--starred"
          onClick={(): void => unStarAPoll(poll._id)}
          data-testid={poll._id}
        >
          <FontAwesomeIcon icon={solidStar} />
        </button>
      </div>
    ),
  );
  const pollList =
    starredPolls.length === 0 ? (
      <p className="user-polls__notes">
        You have not saved any polls!
      </p>
    ) : (
      <div className="user-polls__polls">{polls}</div>
    );
  if (errorMessage) {
    return <ErrorMessage>{errorMessage}</ErrorMessage>;
  }
  return (
    <section className="user-polls">
      <h2 className="heading user-polls__heading">Saved polls</h2>
      {isLoading ? <Loader size="big" /> : pollList}
    </section>
  );
};

export default StarredPolls;
