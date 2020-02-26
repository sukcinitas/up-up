import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import formatDate from '../../util/formatDate';
import BarChart from '../BarChart/BarChart.jsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.jsx';

axios.defaults.withCredentials = true;

class Poll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poll: {
        name: '',
        question: '',
        options: {},
        votes: 0,
        createdBy: '',
        createdAt: '',
      },
      hasVoted: false,
      message: '',
      isLoading: true,
      errorMessage: '',
    };
    this.handleVote = this.handleVote.bind(this);
    this.handlePollDeletion = this.handlePollDeletion.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    axios.get(`http://localhost:8080/api/polls/${match.params.id}`)
      .then((res) => {
        const updatedPoll = res.data.poll;
        this.setState({
          isLoading: false,
        }, () => {
          this.setState({
            poll: { ...updatedPoll },
          });
        });
      });
  }

  handleVote(e) {
    const { hasVoted, poll } = this.state;
    const { match } = this.props;
    if (hasVoted) {
      return;
    } // initial dealing with only letting one vote per user
    axios.put(`http://localhost:8080/api/polls/${match.params.id}`, {
      option: e.target.dataset.option,
      options: poll.options,
      votes: poll.votes,
    })
      .then((res) => {
        this.setState({
          hasVoted: true,
          message: 'Your vote has been successfully submitted!',
        }, () => {
          this.setState({
            poll: res.data.poll,
          });
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  handlePollDeletion() {
    const { history, match } = this.props;
    axios.delete(`http://localhost:8080/api/polls/${match.params.id}`)
      .then(() => {
        history.push('/');
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status} ${error.response.statusText}`,
        });
      });
  }

  render() {
    const { username } = this.props;
    const { poll, errorMessage } = this.state;
    const {
      name, question, options, votes, createdBy, createdAt,
    } = poll;
    const data = {
      optionsList: Object.keys(options).map((option) => ({ option, votes: options[option] })),
      sumVotes: votes,
    };

    const { message, isLoading } = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div>
        <div style={{ height: '30px' }}>
          {message && <span>{message}</span>}
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        </div>
        <h2>{name}</h2>
        <div>
          <h3>{question}</h3>
          <BarChart data={data} />
          {Object.keys(options).map((option) => (
            <div key={option}>
              <button type="button" data-testid={option} data-option={option} onClick={this.handleVote}>{option}</button>
              <small>{options[option]}</small>
            </div>
          ))}
          <p>{votes}</p>
          <p>{createdBy}</p>
          <p>{formatDate(createdAt)}</p>
        </div>
        {username === createdBy ? <button type="button" onClick={this.handlePollDeletion}>Delete</button> : ''}
      </div>
    );
  }
}

Poll.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.username,
});

export default connect(mapStateToProps)(Poll);
