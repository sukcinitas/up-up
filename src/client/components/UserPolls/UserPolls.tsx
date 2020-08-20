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
        if (res.data.polls) {
          this.setState({
            userPolls: [...res.data.polls],
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  handlePollDeletion(e:React.MouseEvent<HTMLButtonElement>) {
    axios.delete(`/api/polls/${e.currentTarget.id}`)
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
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        <Link to="/user/create-poll" className="user-polls__btn--create">Create a poll</Link>
        { isLoading ? <Loader size="big" /> : userPolls.length === 0
          ? <p className="user-polls__notes">You have not created any polls yet!</p>
          : polls}
      </section>
    );
  }
}

export default UserPolls;
