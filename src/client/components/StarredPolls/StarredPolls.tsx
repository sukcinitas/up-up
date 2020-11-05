/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState, getStarredPollsAsync } from '../../redux/actions';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import '../../sass/UserPolls.scss';

axios.defaults.withCredentials = true;

interface IStarredPollsStateProps {
  starredPolls:Array<string>,
  username:string,
  userId: string,
}
interface IStarredPollsDispatchProps {
  getStarredPollsAsync: (username:string) => any,
}
type AllProps = IStarredPollsStateProps & IStarredPollsDispatchProps;
interface IStarredPollsState {
  starredPolls: {
    _id:string,
    name:string,
    votes:number
  }[],
  errorMessage: string,
  isLoading: boolean,
}

class StarredPolls extends React.Component<AllProps, IStarredPollsState> {
  constructor(props:AllProps) {
    super(props);
    this.state = {
      starredPolls: [],
      errorMessage: '',
      isLoading: true,
    };
    this.getStarredPolls = this.getStarredPolls.bind(this);
    this.unStarAPoll = this.unStarAPoll.bind(this);
  }

  componentDidMount() {
    this.getStarredPolls();
  }

  getStarredPolls() {
    const { starredPolls } = this.props;
    axios.post('/api/polls/starred', { listOfIds: starredPolls })
      .then((res) => {
        if (res.data.success) {
          this.setState({
            starredPolls: [...res.data.polls],
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          errorMessage: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  unStarAPoll(pollId:string):void {
    const {
      // eslint-disable-next-line no-shadow
      userId, username, getStarredPollsAsync,
    } = this.props;
    const { starredPolls } = this.state;
    axios.put('/api/user/unstar-poll', {
      id: userId,
      pollId,
    })
      .then((res) => {
        if (res.data.success) {
          getStarredPollsAsync(username);
          this.setState({
            starredPolls: starredPolls.filter((poll) => poll._id !== pollId),
          });
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  render() {
    const { starredPolls, errorMessage, isLoading } = this.state;
    const polls = starredPolls.map((poll:{
      _id:string,
      name:string,
      votes:number,
    }) => (
      <div key={`${poll._id}-starred`} className="user-polls__poll">
        <Link to={`/polls/${poll._id}`} className="user-polls__title">{poll.name}</Link>
        <button
          type="button"
          className="user-polls__star--starred"
          onClick={() => this.unStarAPoll(poll._id)}
          data-testid={poll._id}
        >
          <FontAwesomeIcon icon={['fas', 'star']} />
        </button>
      </div>
    ));
    return (
      <section className="user-polls">
        <h2 className="heading user-polls__heading">Saved polls</h2>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        { isLoading ? <Loader size="big" /> : starredPolls.length === 0
          ? <p className="user-polls__notes">You have not saved any polls yet!</p>
          : <div className="user-polls__polls">{polls}</div>}
      </section>
    );
  }
}

const mapStateToProps = (state:AppState) => ({
  starredPolls: state.starredPolls,
  username: state.username,
  userId: state.userId,
});
const mapDispatchToProps = (dispatch:Dispatch) => ({
  getStarredPollsAsync: (username:string) => dispatch(getStarredPollsAsync(username)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StarredPolls);
