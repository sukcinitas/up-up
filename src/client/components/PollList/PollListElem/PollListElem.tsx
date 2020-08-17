import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { AppState, getStarredPollsAsync } from '../../../redux/actions';
import '../../../sass/PollListElem.scss';

axios.defaults.withCredentials = true;

interface IPollListElemStateProps {
  userId:string,
  username: string,
}
interface IPollListElemProps {
  id:string,
  name:string,
  votes:number,
  createdBy:string,
  updatedAt:string,
  starred:boolean,
}
interface IPollListElemDispatchProps {
  getStarredPollsAsync: (username:string) => any,
}
type AllProps = IPollListElemStateProps & IPollListElemProps & IPollListElemDispatchProps;

interface IPollElemState {
  errorMessage:string,
}
class PollListElem extends React.Component<AllProps, IPollElemState> {
  static propTypes: { id: PropTypes.Validator<string>;
    name: PropTypes.Validator<string>;
    votes: PropTypes.Validator<number>;
    createdBy: PropTypes.Validator<string>;
    updatedAt: PropTypes.Validator<string>; };

  constructor(props:AllProps) {
    super(props);
    this.state = {
      errorMessage: '',
    };
    this.starAPoll = this.starAPoll.bind(this);
    this.unStarAPoll = this.unStarAPoll.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { starred } = this.props;
    // Typical usage (don't forget to compare props):
    if (starred !== prevProps.starred) {
      // eslint-disable-next-line no-console
      console.log(starred, prevProps.starred);
    }
  }

  starAPoll(pollId) {
    // eslint-disable-next-line no-shadow
    const { userId, username, getStarredPollsAsync } = this.props;
    axios.put('/api/user/star-poll', {
      id: userId,
      pollId,
    })
      .then((res) => {
        if (res.data.success) {
          getStarredPollsAsync(username);
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  unStarAPoll(pollId) {
    // eslint-disable-next-line no-shadow
    const { userId, username, getStarredPollsAsync } = this.props;
    axios.put('/api/user/unstar-poll', {
      id: userId,
      pollId,
    })
      .then((res) => {
        if (res.data.success) {
          getStarredPollsAsync(username);
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  render() {
    const {
      id, name, votes, createdBy, updatedAt, userId, starred,
    } = this.props;
    const { errorMessage } = this.state;
    // eslint-disable-next-line no-console
    console.log('my id', id, starred);
    return (
      <div className="poll-list-elem">
        <Link to={`/polls/${id}`} className="poll-list-elem__heading">
          <h2>{name}</h2>
        </Link>
        <div className="poll-list-elem__details">
          <p className="poll-list-elem__created-by">
            created by
            <span>
              {` ${createdBy}`}
            </span>
          </p>
          <span className="transparent" />
          <p className="poll-list-elem__votes">
            <span>{votes}</span>
            {votes === 1 ? ' vote' : ' votes'}
          </p>
          <span className="transparent" />
          <p className="poll-list-elem__updated-at">
            last updated on
            {` ${updatedAt}`}
          </p>
        </div>
        { userId && (
        <button
          type="button"
          className={`poll-list-elem__star ${starred ? 'poll-list-elem__star--starred' : ''}`}
          onClick={starred ? () => this.unStarAPoll(id) : () => this.starAPoll(id)}
        >
          {starred ? <FontAwesomeIcon icon={['fas', 'star']} /> : <FontAwesomeIcon icon={['far', 'star']} />}
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

const mapStateToProps = (state:AppState) => ({
  userId: state.userId,
  username: state.username,
  starredPolls: state.starredPolls,
});
const mapDispatchToProps = (dispatch:Dispatch) => ({
  getStarredPollsAsync: (username:string) => dispatch(getStarredPollsAsync(username)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PollListElem);
