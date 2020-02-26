import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage.jsx';

axios.defaults.withCredentials = true;

class UserPolls extends React.Component {
  constructor() {
    super();
    this.state = {
      userPolls: [],
      errorMessage: '',
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
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  handlePollDeletion(e) {
    axios.delete(`http://localhost:8080/api/polls/${e.target.id}`)
      .then(() => {
        this.getUserPolls();
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  render() {
    const { userPolls, errorMessage } = this.state;
    return (
      <div>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        {
          userPolls.length === 0
            ? <p>You have not created any polls yet!</p>
            : userPolls.map((poll) => (
              <div key={poll.id} data-testid={`div${poll.id}`}>
                <h3>{poll.name}</h3>
                <p>
                  { poll.votes === 1 ? `${poll.votes} vote` : `${poll.votes} votes`}
                </p>
                <button data-testid={poll.id} type="button" id={poll.id} onClick={this.handlePollDeletion}>Delete</button>
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
