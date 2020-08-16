import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../redux/actions';
import PollListElem from './PollListElem/PollListElem';
import Loader from '../Loader/Loader';
import formatDate from '../../util/formatDate';
import '../../sass/PollList.scss';

axios.defaults.withCredentials = true;

interface IPollListStateProps {
  username:string,
}
type AllProps = IPollListStateProps;

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
      sortType: 'newest',
    };
    this.sort = this.sort.bind(this);
  }

  componentDidMount() {
    axios.get('/api/polls')
      .then((res) => {
        const sortedPolls = res.data.polls.sort((a, b) => new Date(b.createdAt).valueOf()
        - new Date(a.createdAt).valueOf());
        this.setState({
          polls: [...sortedPolls],
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error ${error.response.status}: ${error.response.statusText}`,
          isLoading: false,
        });
      });
  }

  sort(type) {
    const { polls } = this.state;
    if (type === 'newest') {
      const sortedPolls = polls.sort((a, b) => new Date(b.createdAt).valueOf()
      - new Date(a.createdAt).valueOf());
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
    const { username } = this.props;
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
              className={`btn btn--supp ${sortType === 'newest' ? 'btn--supp--selected' : ''}`}
              onClick={() => this.sort('newest')}
            >
              newest
            </button>
            <button
              type="button"
              className={`btn btn--supp ${sortType === 'most-popular' ? 'btn--supp--selected' : ''}`}
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
});

export default connect(mapStateToProps)(PollList);
