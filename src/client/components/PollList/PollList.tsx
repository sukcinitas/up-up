import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../redux/actions';
import PollListElem from './PollListElem/PollListElem';
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
}

class PollList extends React.Component<AllProps, IPollListState> {
  static propTypes: { username: PropTypes.Validator<string>; };

  constructor(props:AllProps) {
    super(props);
    this.state = {
      polls: [],
      isLoading: true,
      errorMessage: '',
    };
  }

  componentDidMount() {
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
  }

  render() {
    const { username } = this.props;
    const { polls, isLoading, errorMessage } = this.state;
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
    return (
      <div data-testid="test-polls-list" className="poll-list">
        {username && <Link to="/user/create-poll" className="btn btn--create">Create a poll</Link>}
        {isLoading && <h3>Loading...</h3>}
        {errorMessage ? <h3>{errorMessage}</h3> : list}
      </div>
    );
  }
}

const mapStateToProps = (state:AppState):IPollListStateProps => ({
  username: state.username,
});

export default connect(mapStateToProps)(PollList);
