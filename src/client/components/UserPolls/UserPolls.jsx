import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

axios.defaults.withCredentials = true;

class UserPolls extends React.Component {
  constructor() {
    super();
    this.state = {
      userPolls: [],
    };
    this.handlePollDeletion = this.handlePollDeletion.bind(this);
    this.getUserPolls = this.getUserPolls.bind(this);
  }

  componentDidMount() {
    this.getUserPolls();
  }

  getUserPolls() {
    const { username } = this.props;
    axios.get(`http://localhost:8080/api/user/polls/${username}`)
      .then((res) => {
        if (res.data.polls) {
          this.setState({
            userPolls: [...res.data.polls],
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handlePollDeletion(e) {
    axios.delete(`http://localhost:8080/api/polls/${e.target.id}`)
      .then(() => {
        this.getUserPolls();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { userPolls } = this.state;
    return (
      <div>
        {
          userPolls.length === 0
            ? <p>You have no polls created!</p>
            : userPolls.map((poll) => (
              <div key={poll.id}>
                <h3>{poll.name}</h3>
                <p>
                  {poll.votes}
                  {poll.votes === 1 ? ' vote' : ' votes'}
                </p>
                <button type="button" id={poll.id} onClick={this.handlePollDeletion}>Delete</button>
              </div>
            ))
      }
      </div>
    );
  }
}

UserPolls.propTypes = {
  username: PropTypes.string.isRequired,
};

export default UserPolls;
