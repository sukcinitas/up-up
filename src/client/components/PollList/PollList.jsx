import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './PollList.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PollListElem from './PollListElem/PollListElem.jsx';
import formatDate from '../../util/formatDate';

axios.defaults.withCredentials = true;


class PollList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: [],
      isLoading: true,
      errorMessage: '',
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8080/api/polls')
      .then((res) => {
        this.setState({
          polls: [...res.data.polls],
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Could not load polls! ${error.message}`,
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
        {isLoading && <h3>Loading...</h3>}
        {errorMessage ? <h3>{errorMessage}</h3> : list}
        {username && <Link to="/user/create-poll">Create a poll</Link>}
      </div>
    );
  }
}

PollList.propTypes = {
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.username,
});

export default connect(mapStateToProps)(PollList);
