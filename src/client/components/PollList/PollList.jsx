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
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8080/api/polls')
      .then((res) => {
        this.setState({
          polls: [...res.data],
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { username } = this.props;
    const { polls, isLoading } = this.state;
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
      return <p>Loading...</p>;
    }
    return (
      <div className="poll-list">
        {list}
        {username ? <Link to="/user/create-poll">Create a poll</Link> : ''}
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
