import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import formatDate from '../../util/formatDate';
import BarChart from '../BarChart/BarChart';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import DeleteButton from '../DeleteButton/DeleteButton';
import Loader from '../Loader/Loader';
import '../../sass/Poll.scss';
import barChartWidth from '../../util/barChartWidth';
import { RootState } from '../../store';

axios.defaults.withCredentials = true;

const Poll = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const username = useSelector((state: RootState) => state.users.username);
  const [poll, setPoll] = useState({
    name: '',
    question: '',
    options: [],
    votes: 0,
    createdBy: '',
    createdAt: '',
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [chartParams, setChartParams] = useState({
    width: 544,
    leftMargin: 100,
  });

  useEffect(() => {
    const fetchData = (): void => {
      setIsLoading(true);
      axios.get(`/api/polls/${id}`).then(
        (res) => {
          if (res.data.success) {
            setPoll({ ...res.data.poll });
            setIsLoading(false);
            const { w: width, left: leftMargin } = barChartWidth();
            setChartParams({ width, leftMargin });
          }
        },
        (err) => {
          setLoadError(
            err.response.data.message ||
              `${err.response.status}: ${err.response.statusText}`,
          );
          setIsLoading(false);
        },
      );
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const setSize = (e?: Event): void => {
      const { windowW } = barChartWidth();
      const width = barChartWidth().w;
      const leftMargin = barChartWidth().left;
      // Apparently on mobile devices window emits resize event when browser navigation is hidden
      // so if device width is small, I make it to not change dinamically,
      // and it doesn't need to as it pretty much changes only when orientation does
      if (e && e.type !== 'orientationchange' && windowW < 480) {
        return;
      }
      setChartParams({ width, leftMargin });
    };
    window.addEventListener('resize', setSize);
    window.addEventListener('orientationchange', setSize);
    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('orientationchange', setSize);
    };
  }, []);

  const handleVote = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    const selectedOption = e.currentTarget;
    const { dataset } = e.currentTarget;
    if (hasVoted) {
      return;
    } // initial dealing with only letting one vote per user
    axios
      .put(`/api/polls/${id}`, {
        option: {
          option: dataset.option,
          votes: dataset.votes,
        },
        options: poll.options,
        votes: poll.votes,
      })
      .then(
        (res) => {
          if (res.data.success) {
            setHasVoted(true);
            setPoll({ ...res.data.poll });
            selectedOption.classList.add('btn--selected');
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

  const handlePollDeletion = (): void => {
    axios.delete(`/api/polls/${id}`).then(
      (res) => {
        if (res.data.success) {
          navigate('/');
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

  const {
    name,
    question,
    options,
    votes,
    createdBy,
    createdAt,
  } = poll;
  const data: {
    optionsList: { option: string; votes: number }[];
    sumVotes: number;
  } = {
    optionsList: options,
    sumVotes: votes,
  };

  if (isLoading) {
    return <Loader size="big" />;
  }
  if (loadError) {
    return <p>{loadError}</p>;
  }
  return (
    <div className="poll">
      <div>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </div>
      <h2 className="heading poll__heading">{name}</h2>
      <h3 className="subheading poll__subheading">{question}</h3>
      {username === createdBy && (
        <DeleteButton callback={handlePollDeletion} poll />
      )}
      <div className="additional poll__additional">
        <p>{`created by ${createdBy}`}</p>
        <p> | </p>
        <p>{`created on ${formatDate(createdAt)}`}</p>
      </div>
      <div className="poll__section">
        <div className="poll__options">
          {options.map((option) => (
            <div className="poll__option" key={option.option}>
              <button
                type="button"
                data-testid={option.option}
                data-option={option.option}
                data-votes={option.votes}
                onClick={handleVote}
                className="btn btn--vote"
                title={option.option}
              >
                {option.option}
              </button>
            </div>
          ))}
          <p className="poll__votes">{`Total votes: ${votes}`}</p>
        </div>
        <BarChart
          data={data}
          width={chartParams.width}
          leftMargin={chartParams.leftMargin}
        />
      </div>
    </div>
  );
};

export default Poll;
