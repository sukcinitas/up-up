/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import '../../sass/UserPolls.scss';

axios.defaults.withCredentials = true;

interface IUserPollsProps {
  username:string,
}

interface IUserPollsState {
  userPolls: {
    id:string,
    name:string,
    votes:number
  }[],
  errorMessage: string,
  isLoading: boolean,
}

class UserPolls extends React.Component<IUserPollsProps, IUserPollsState> {
  static propTypes: { username: PropTypes.Validator<string>; };

  constructor(props:IUserPollsProps) {
    super(props);
    this.state = {
      userPolls: [],
      errorMessage: '',
      isLoading: true,
    };
    this.handlePollDeletion = this.handlePollDeletion.bind(this);
    this.getUserPolls = this.getUserPolls.bind(this);
  }

  componentDidMount() {
    this.getUserPolls();
  }

  getUserPolls() {
    const { username } = this.props;
    axios.get(`/api/polls/user/${username}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            userPolls: [...res.data.polls],
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
          isLoading: false,
        });
      });
  }

  handlePollDeletion(e:React.MouseEvent<HTMLButtonElement>) {
    axios.delete(`/api/polls/${e.currentTarget.id}`)
      .then((res) => {
        if (res.data.success) {
          this.getUserPolls();
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  render() {
    const { userPolls, errorMessage, isLoading } = this.state;
    const polls = userPolls.map((poll:{
      id:string,
      name:string,
      votes:number,
    }) => (
      <div key={poll.id} data-testid={`div${poll.id}`} className="user-polls__poll">
        <Link to={`/polls/${poll.id}`} className="user-polls__title">{poll.name}</Link>
        <p className="user-polls__votes">
          { poll.votes === 1 ? `${poll.votes} vote` : `${poll.votes} votes`}
        </p>
        <button
          data-testid={poll.id}
          type="button"
          id={poll.id}
          onClick={this.handlePollDeletion}
          className="btn btn--delete user-polls__btn"
        >
          Delete
        </button>
      </div>
    ));
    return (
      <section className="user-polls">
        <h2 className="heading user-polls__heading">Polls</h2>
        <Link to="/user/create-poll" className="user-polls__btn--create">Create a poll</Link>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        { isLoading ? <Loader size="big" /> : userPolls.length === 0 && !errorMessage
          ? <p className="user-polls__notes">You have not created any polls yet!</p>
          : <div className="user-polls__polls">{polls}</div>}
      </section>
    );
  }
}

export default UserPolls;
