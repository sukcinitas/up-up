import * as React from 'react';
import * as PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { ActionTypes } from '../../redux/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import { logoutCurrentUser, AppState } from '../../redux/actions';
import UserPolls from '../UserPolls/UserPolls';
import ProfileEmail from '../ProfileEmail/ProfileEmail';
import ProfilePassword from '../ProfilePassword/ProfilePassword';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

axios.defaults.withCredentials = true;

interface IProfileProps extends RouteComponentProps {
};
interface IProfileDispatchProps {
  logout: () => void,
};
type AllProps = IProfileProps & AppState & IProfileDispatchProps;

interface IProfileState {
  message:string,
  errorMessage:string,
};


class Profile extends React.Component<AllProps, IProfileState> {
  static propTypes: { username: PropTypes.Validator<string>; userId: PropTypes.Validator<string>; history: any; logout: PropTypes.Validator<(...args: any[]) => any>; };
  constructor(props:AllProps) {
    super(props);
    this.state = {
      message: '',
      errorMessage: '',
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    const { history, userId, logout } = this.props;
    axios.delete('http://localhost:8080/api/user/profile', { id: userId })
      .then(() => {
        this.setState({
          message: 'User has been successfully deleted!',
        }, () => {
          setTimeout(() => {
            logout();
            history.push('/');
          }, 1000);
        });
      })
      .catch((error:any) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  render() {
    const { username, userId } = this.props;
    const { message, errorMessage } = this.state;
    if (message) {
      return <p>{message}</p>;
    }
    return (
      <div>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        <section>
          <h2>User information</h2>
          <div>
            <div>
              <p>
                Username:
                {username}
              </p>
            </div>
            <ProfileEmail
              username={username}
              userId={userId}
            />
            <ProfilePassword
              username={username}
              userId={userId}
            />
            <div>
              <button type="button" onClick={this.handleDelete}>Delete account</button>
            </div>
          </div>
        </section>
        <section>
          <h2>Polls</h2>
          <UserPolls username={username} />
          <Link to="/user/create-poll">Create a poll</Link>
        </section>
      </div>
    );
  }
}

Profile.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state:AppState) => ({
  username: state.username,
  userId: state.userId,
});
const mapDispatchToProps = (dispatch:Dispatch<ActionTypes>) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

export default connect<AppState, IProfileDispatchProps, IProfileProps>(mapStateToProps, mapDispatchToProps)(Profile);
