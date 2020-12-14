/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch } from 'redux';
import {
  AppState,
  getStarredPollsAsync,
} from '../../../redux/actions';
import '../../../sass/PollListElem.scss';

axios.defaults.withCredentials = true;

interface IPollListElemStateProps {
  userId: string;
  username: string;
}
interface IPollListElemProps {
  id: string;
  name: string;
  votes: number;
  createdBy: string;
  updatedAt: string;
  starred: boolean;
  link: Function;
}
interface IPollListElemDispatchProps {
  getStarredPollsAsync: (username: string) => any;
}
type AllProps = IPollListElemStateProps &
  IPollListElemProps &
  IPollListElemDispatchProps;

interface IPollElemState {
  errorMessage: string;
}
class PollListElem extends React.Component<AllProps, IPollElemState> {
  static propTypes: {
    id: PropTypes.Validator<string>;
    name: PropTypes.Validator<string>;
    votes: PropTypes.Validator<number>;
    createdBy: PropTypes.Validator<string>;
    updatedAt: PropTypes.Validator<string>;
  };

  constructor(props: AllProps) {
    super(props);
    this.state = {
      errorMessage: '',
    };
    this.starAPoll = this.starAPoll.bind(this);
    this.unStarAPoll = this.unStarAPoll.bind(this);
    this.goToPoll = this.goToPoll.bind(this);
  }

  starAPoll(
    pollId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    event.stopPropagation();
    // eslint-disable-next-line no-shadow
    const { userId, username, getStarredPollsAsync } = this.props;
    axios
      .put('/api/user/star-poll', {
        id: userId,
        pollId,
      })
      .then((res) => {
        if (res.data.success) {
          getStarredPollsAsync(username);
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

  unStarAPoll(
    pollId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    event.stopPropagation();
    // eslint-disable-next-line no-shadow
    const { userId, username, getStarredPollsAsync } = this.props;
    axios
      .put('/api/user/unstar-poll', {
        id: userId,
        pollId,
      })
      .then((res) => {
        if (res.data.success) {
          getStarredPollsAsync(username);
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

  goToPoll(id: string): void {
    const { link } = this.props;
    link(id);
  }

  render() {
    const {
      id,
      name,
      votes,
      createdBy,
      updatedAt,
      userId,
      starred,
    } = this.props;
    const { errorMessage } = this.state;
    return (
      <div
        role="button"
        tabIndex={0}
        className="poll-list-elem"
        onClick={() => this.goToPoll(id)}
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
                ? (e) => this.unStarAPoll(id, e)
                : (e) => this.starAPoll(id, e)
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
  }
}

PollListElem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  createdBy: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
};

const mapStateToProps = (state: AppState) => ({
  userId: state.userId,
  username: state.username,
  starredPolls: state.starredPolls,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  getStarredPollsAsync: (username: string) =>
    dispatch(getStarredPollsAsync(username)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PollListElem);
