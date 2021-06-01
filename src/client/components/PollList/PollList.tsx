/* eslint-disable @typescript-eslint/indent */
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

const PollList = ({ history }: RouteComponentProps) => {
  const dispatch = useDispatch();
  const { username, starredPolls } = useSelector((state: AppState) => ({
    username: state.username,
    starredPolls: state.starredPolls,
  }));
  const [polls, setPolls] = useState<
    Array<{
      id: string;
      name: string;
      votes: number;
      createdBy: string;
      updatedAt: string;
    }>
  >([]);
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
    let sortedPolls: Array<{
      id: string;
      name: string;
      votes: number;
      createdBy: string;
      updatedAt: string;
    }> = [];
    if (type === 'newest') {
      sortedPolls = [...polls].sort(
        (a, b) =>
          new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf(),
      );
      setSortType('newest');
    } else if (type === 'most-popular') {
      sortedPolls = [...polls].sort((a, b) => b.votes - a.votes);
      setSortType('most-popular');
    }
    setPolls(sortedPolls);
  };

  const list = polls.map(
    ({ id: pollId, name, votes, createdBy, updatedAt }, index) => (
      <div key={new Date().getTime() + index} className="poll-list-elem-wrapper">
        <PollListElem
          name={name}
          votes={votes}
          createdBy={username === createdBy ? 'you' : createdBy}
          updatedAt={formatDate(updatedAt)}
          id={pollId}
          starred={starredPolls.indexOf(pollId) > -1}
          link={(id: string): void => history.push(`/polls/${id}`)}
        />
      </div>
    ),
  );
  if (isLoading) {
    return <Loader size="default" />;
  }
  if (loadError) {
    return <p>{loadError}</p>;
  }
  return (
    <div data-testid="test-polls-list" className="poll-list">
      <div className="poll-list__supp">
        <Link
          to="/user/create-poll"
          className={`btn ${username ? 'btn--create' : 'btn--hidden'}`}
        >
          Create a poll
        </Link>
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
