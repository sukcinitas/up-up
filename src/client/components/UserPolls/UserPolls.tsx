import * as React from 'react';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
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
}

class UserPolls extends React.Component<IUserPollsProps, IUserPollsState> {
  static propTypes: { username: PropTypes.Validator<string>; };

  constructor(props:IUserPollsProps) {
    super(props);
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

  handlePollDeletion(e:React.MouseEvent<HTMLButtonElement>) {
    axios.delete(`http://localhost:8080/api/polls/${e.currentTarget.id}`)
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
      <section className="user-polls">
        <h2 className="heading user-polls__heading">Polls</h2>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        <Link to="/user/create-poll" className="btn btn--create">Create a poll</Link>
        {
          userPolls.length === 0
            ? <p className="user-polls__notes">You have not created any polls yet!</p>
            : userPolls.map((poll:{
              id:string,
              name:string,
              votes:number,
            }) => (
              <div key={poll.id} data-testid={`div${poll.id}`} className="user-polls__poll">
                <Link to={`/polls/${poll.id}`} className="user-polls__title">{poll.name}</Link>
                <p className="user-polls__votes">
                  { poll.votes === 1 ? `${poll.votes} vote` : `${poll.votes} votes`}
                </p>
                <button data-testid={poll.id} type="button" id={poll.id} onClick={this.handlePollDeletion} className="btn btn--delete user-polls__btn">Delete</button>
              </div>
            ))
      }
      </section>
    );
  }
}

export default UserPolls;
