import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
type AllProps = IPollListStateProps & IPollListDispatchProps;

interface IPollListState {
  polls:Array<any>,
  isLoading:boolean,
  errorMessage:string,
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
      sortType: 'newest', // initiallly I sort in server
    };
    this.sort = this.sort.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line no-shadow
    const { username, getStarredPollsAsync } = this.props;
    axios.get('/api/polls')
      .then((res) => {
        this.setState({
          polls: [...res.data.polls],
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error ${error.response.status}: ${error.response.statusText}`,
          isLoading: false,
        });
      });
    if (username) {
      getStarredPollsAsync(username);
    }
  }

  sort(type) {
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

  render() {
    const { username, starredPolls } = this.props;
    const {
      polls, isLoading, errorMessage, sortType,
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
        />
      </div>
    ));
    if (isLoading) {
      return <Loader size="default" />;
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
