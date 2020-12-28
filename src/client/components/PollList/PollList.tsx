import * as React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { Link, RouteComponentProps } from 'react-router-dom';
import { AppState, getStarredPollsAsync } from '../../redux/actions';
import PollListElem from './PollListElem/PollListElem';
import Loader from '../Loader/Loader';
import formatDate from '../../util/formatDate';
import '../../sass/PollList.scss';

axios.defaults.withCredentials = true;

interface IPollListProps extends RouteComponentProps {}

const PollList = ({ history }: RouteComponentProps) => {
  const dispatch = useDispatch();
  const { username } = useSelector((state: AppState) => ({
    username: state.username,
  }));
  const { starredPolls } = useSelector((state: AppState) => ({
    starredPolls: state.starredPolls,
  }));
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [sortType, setSortType] = useState('newest'); // initially I sort in server

  useEffect(() => {
    let isSubscribed = true;
    const fetchPolls = () => {
      setIsLoading(true);
      axios.get('/api/polls').then(
        (res) => {
          if (res.data.success && isSubscribed) {
            setIsLoading(false);
            setPolls([...res.data.polls]);
          }
        },
        (err) => {
          if (isSubscribed) {
            setIsLoading(false);
            setLoadError(
              err.response.data.message ||
                `${err.response.status}: ${err.response.statusText}`,
            );
          }
        },
      );
      if (username) {
        dispatch(getStarredPollsAsync(username));
      }
    };
    fetchPolls();
    return () => {
      isSubscribed = false;
    };
  }, [username, dispatch]);

  const sort = (type: string): void => {
    if (type === 'newest') {
      const sortedPolls = polls.sort(
        (a, b) =>
          new Date(b.updatedAt).valueOf() -
          new Date(a.updatedAt).valueOf(),
      );
      setSortType('newest');
      setPolls(sortedPolls);
    } else if (type === 'most-popular') {
      const sortedPolls = polls.sort((a, b) => b.votes - a.votes);
      setSortType('most-popular');
      setPolls(sortedPolls);
    }
  };

  const visitPoll = (id: string): void => {
    history.push(`/polls/${id}`);
  };

  const list = polls.map((poll) => (
    <div key={poll.id}>
      <PollListElem
        name={poll.name}
        votes={poll.votes}
        createdBy={
          username === poll.createdBy ? 'you' : poll.createdBy
        }
        updatedAt={formatDate(poll.updatedAt)}
        id={poll.id}
        starred={starredPolls.indexOf(poll.id) > -1}
        link={(id: string): void => visitPoll(id)}
      />
    </div>
  ));
  if (isLoading) {
    return <Loader size="default" />;
  }
  if (loadError) {
    return <p>{loadError}</p>;
  }
  return (
    <div data-testid="test-polls-list" className="poll-list">
      <div className="poll-list__supp">
        {username ? (
          <Link to="/user/create-poll" className="btn btn--create">
            Create a poll
          </Link>
        ) : (
          <Link
            to="/user/create-poll"
            className="btn btn--create btn--hidden"
          >
            Create a poll
          </Link>
        )}
        <div className="poll-list__sort">
          <button
            type="button"
            className={`btn btn--supp ${
              sortType === 'newest' ? 'btn--supp-selected' : ''
            }`}
            onClick={() => sort('newest')}
          >
            lastly updated
          </button>
          <button
            type="button"
            className={`btn btn--supp ${
              sortType === 'most-popular' ? 'btn--supp-selected' : ''
            }`}
            onClick={() => sort('most-popular')}
          >
            most popular
          </button>
        </div>
      </div>
      {list}
    </div>
  );
};

PollList.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
};

export default PollList;
