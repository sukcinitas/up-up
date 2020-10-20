import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { AppState, getStarredPollsAsync } from '../../redux/actions';
import PollListElem from './PollListElem/PollListElem';
import Loader from '../Loader/Loader';
import formatDate from '../../util/formatDate';
import '../../sass/PollList.scss';

axios.defaults.withCredentials = true;

interface IPollListStateProps {
  username:string,
  starredPolls:Array<string>,
}
interface IPollListDispatchProps {
  getStarredPollsAsync: (username:string) => any,
}
interface IPollListRouteProps extends RouteComponentProps {}

type AllProps = IPollListStateProps & IPollListDispatchProps & IPollListRouteProps;

interface IPollListState {
  polls:Array<any>,
  isLoading:boolean,
  errorMessage:string,
  loadError:string,
  sortType:string,
}

class PollList extends React.Component<AllProps, IPollListState> {
  static propTypes: { username: PropTypes.Validator<string>; };

  constructor(props:AllProps) {
    super(props);
    this.state = {
      polls: [],
      isLoading: true,
      errorMessage: '',
      loadError: '',
      sortType: 'newest', // initiallly I sort in server
    };
    this.sort = this.sort.bind(this);
    this.visitPoll = this.visitPoll.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const { username, getStarredPollsAsync } = this.props;
    axios.get('/api/polls')
      .then((res) => {
        if (res.data.success) {
          this.setState({
            polls: [...res.data.polls],
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          loadError: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
          isLoading: false,
        });
      });
    if (username) {
      getStarredPollsAsync(username);
    }
  }

  sort(type:string):void {
    const { polls } = this.state;
    if (type === 'newest') {
      const sortedPolls = polls.sort((a, b) => new Date(b.updatedAt).valueOf()
      - new Date(a.updatedAt).valueOf());
      this.setState({
        sortType: 'newest',
        polls: sortedPolls,
      });
    } else if (type === 'most-popular') {
      const sortedPolls = polls.sort((a, b) => b.votes - a.votes);
      this.setState({
        sortType: 'most-popular',
        polls: sortedPolls,
      });
    }
  }

  visitPoll(id:string):void {
    const { history } = this.props;
    history.push(`/polls/${id}`);
  }

  render() {
    const { username, starredPolls } = this.props;
    const {
      polls, isLoading, errorMessage, sortType, loadError,
    } = this.state;
    const list = polls.map((poll) => (
      <div key={poll.id}>
        <PollListElem
          name={poll.name}
          votes={poll.votes}
          createdBy={username === poll.createdBy ? 'you' : poll.createdBy}
          updatedAt={formatDate(poll.updatedAt)}
          id={poll.id}
          starred={starredPolls.indexOf(poll.id) > -1}
          link={(id:string):void => this.visitPoll(id)}
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
          {username ? <Link to="/user/create-poll" className="btn btn--create">Create a poll</Link>
            : <Link to="/user/create-poll" className="btn btn--create btn--hidden">Create a poll</Link>}
          <div className="poll-list__sort">
            <button
              type="button"
              className={`btn btn--supp ${sortType === 'newest' ? 'btn--supp-selected' : ''}`}
              onClick={() => this.sort('newest')}
            >
              lastly updated
            </button>
            <button
              type="button"
              className={`btn btn--supp ${sortType === 'most-popular' ? 'btn--supp-selected' : ''}`}
              onClick={() => this.sort('most-popular')}
            >
              most popular
            </button>
          </div>
        </div>
        {errorMessage ? <h3>{errorMessage}</h3> : list}
      </div>
    );
  }
}

const mapStateToProps = (state:AppState):IPollListStateProps => ({
  username: state.username,
  starredPolls: state.starredPolls,
});
const mapDispatchToProps = (dispatch:Dispatch) => ({
  getStarredPollsAsync: (username:string) => dispatch(getStarredPollsAsync(username)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PollList);
