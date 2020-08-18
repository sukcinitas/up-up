/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState, getStarredPollsAsync } from '../../redux/actions';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import '../../sass/UserPolls.scss';

axios.defaults.withCredentials = true;

interface IStarredPollsStateProps {
  starredPolls:Array<string>,
  username:string,
}
interface IStarredPollsDispatchProps {
  getStarredPollsAsync: (username:string) => any,
}
type AllProps = IStarredPollsStateProps & IStarredPollsDispatchProps;
interface IStarredPollsState {
  starredPolls: {
    _id:string,
    name:string,
    votes:number
  }[],
  errorMessage: string,
  isLoading: boolean,
}

class StarredPolls extends React.Component<AllProps, IStarredPollsState> {
  constructor(props:AllProps) {
    super(props);
    this.state = {
      starredPolls: [],
      errorMessage: '',
      isLoading: true,
    };
    this.getStarredPolls = this.getStarredPolls.bind(this);
  }

  componentDidMount() {
    this.getStarredPolls();
  }

  getStarredPolls() {
    const { starredPolls } = this.props;
    axios.post('/api/polls/starred', { listOfIds: starredPolls })
      .then((res) => {
        if (res.data.polls) {
          this.setState({
            starredPolls: [...res.data.polls],
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

  render() {
    const { starredPolls, errorMessage, isLoading } = this.state;
    const polls = starredPolls.map((poll:{
      _id:string,
      name:string,
      votes:number,
    }) => (
      <div key={`${poll._id}-starred`} data-testid={`div${poll._id}`} className="user-polls__poll">
        <Link to={`/polls/${poll._id}`} className="user-polls__title">{poll.name}</Link>
        <p className="user-polls__votes">
          { poll.votes === 1 ? `${poll.votes} vote` : `${poll.votes} votes`}
        </p>
      </div>
    ));
    return (
      <section className="user-polls">
        <h2 className="heading user-polls__heading">Saved Polls</h2>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        { isLoading ? <Loader size="big" /> : starredPolls.length === 0
          ? <p className="user-polls__notes">You have not saved any polls yet!</p>
          : polls}
      </section>
    );
  }
}

const mapStateToProps = (state:AppState) => ({
  starredPolls: state.starredPolls,
  username: state.username,
});
const mapDispatchToProps = (dispatch:Dispatch) => ({
  getStarredPollsAsync: (username:string) => dispatch(getStarredPollsAsync(username)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StarredPolls);
