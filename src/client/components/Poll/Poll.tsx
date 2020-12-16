import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import formatDate from '../../util/formatDate';
import { AppState } from '../../redux/actions';
import BarChart from '../BarChart/BarChart';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import '../../sass/Poll.scss';
import barChartWidth from '../../util/barChartWidth';

axios.defaults.withCredentials = true;

interface IPollStateProps {
  username: string;
}
interface RouteProps extends RouteComponentProps<{ id: string }> {}
type AllProps = RouteProps & IPollStateProps;

interface IPollState {
  poll: {
    name: string;
    question: string;
    options: Array<{ option: string; votes: number }>;
    votes: number;
    createdBy: string;
    createdAt: string;
  };
  hasVoted: boolean;
  message: string;
  loadError: string;
  isLoading: boolean;
  errorMessage: string;
  width: number;
  leftMargin: number;
}

class Poll extends React.Component<AllProps, IPollState> {
  static propTypes: {
    match: any;
    history: any;
    username: PropTypes.Validator<string>;
  };

  constructor(props: AllProps) {
    super(props);
    this.state = {
      poll: {
        name: '',
        question: '',
        options: [],
        votes: 0,
        createdBy: '',
        createdAt: '',
      },
      hasVoted: false,
      message: '',
      loadError: '',
      isLoading: true,
      errorMessage: '',
      width: 544,
      leftMargin: 100,
    };
    this.handleVote = this.handleVote.bind(this);
    this.handlePollDeletion = this.handlePollDeletion.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setSize);
    window.addEventListener('orientationchange', this.setSize);
    this.setState({
      width: barChartWidth().w,
      leftMargin: barChartWidth().left,
    });
    const { match } = this.props;
    axios
      .get(`/api/polls/${match.params.id}`)
      .then((res) => {
        if (res.data.success) {
          const updatedPoll = res.data.poll;
          this.setState(
            {
              isLoading: false,
            },
            () => {
              this.setState({
                poll: { ...updatedPoll },
              });
            },
          );
        }
      })
      .catch((err) => {
        this.setState({
          loadError:
            err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
          isLoading: false,
        });
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSize);
    window.removeEventListener('orientationchange', this.setSize);
  }

  setSize(e: Event) {
    const width = barChartWidth().w;
    const leftMargin = barChartWidth().left;
    const { windowW } = barChartWidth();
    // Apparently on mobile devices window emits resize event when browser navigation is hidden
    // so if device width is small, I make it to not change dinamically,
    // and it doesn't need to as it pretty much changes only when orientation does
    if (e.type !== 'orientationchange' && windowW < 480) {
      return;
    }
    this.setState({
      width,
      leftMargin,
    });
  }

  handleVote(e: React.MouseEvent<HTMLButtonElement>) {
    const { hasVoted, poll } = this.state;
    const { match } = this.props;
    const selectedOption = e.currentTarget;
    if (hasVoted) {
      return;
    } // initial dealing with only letting one vote per user
    axios
      .put(`/api/polls/${match.params.id}`, {
        option: {
          option: e.currentTarget.dataset.option,
          votes: e.currentTarget.dataset.votes,
        },
        options: poll.options,
        votes: poll.votes,
      })
      .then((res) => {
        if (res.data.success) {
          this.setState(
            {
              hasVoted: true,
            },
            () => {
              this.setState({
                poll: res.data.poll,
              });
              selectedOption.classList.add('btn--selected');
            },
          );
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage:
            err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  handlePollDeletion() {
    const { history, match } = this.props;
    axios
      .delete(`/api/polls/${match.params.id}`)
      .then((res) => {
        if (res.data.success) {
          history.push('/');
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage:
            err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  render() {
    const { username } = this.props;
    const {
      poll,
      errorMessage,
      width,
      leftMargin,
      loadError,
    } = this.state;
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

    const { message, isLoading } = this.state;
    if (isLoading) {
      return <Loader size="big" />;
    }
    if (loadError) {
      return <p>{loadError}</p>;
    }
    return (
      <div className="poll">
        <div>
          {message && (
            <span className="form__notes--info">{message}</span>
          )}
          {errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}
        </div>
        <h2 className="heading poll__heading">{name}</h2>
        <h3 className="subheading poll__subheading">{question}</h3>
        {username === createdBy ? (
          <button
            type="button"
            onClick={this.handlePollDeletion}
            className="btn btn--delete btn--delete--poll"
          >
            Delete
          </button>
        ) : (
          ''
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
                  onClick={this.handleVote}
                  className="btn btn--vote"
                >
                  {option.option}
                </button>
              </div>
            ))}
            <p className="poll__votes">{`Total votes: ${votes}`}</p>
          </div>
          <BarChart
            data={data}
            width={width}
            leftMargin={leftMargin}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  username: state.username,
});

export default connect(mapStateToProps)(Poll);
