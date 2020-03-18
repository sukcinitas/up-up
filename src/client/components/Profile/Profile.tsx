import * as React from 'react';
import * as PropTypes from 'prop-types';
// import ReactRouterPropTypes from 'react-router-prop-types';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { ActionTypes, logoutCurrentUser, AppState } from '../../redux/actions';

import UserPolls from '../UserPolls/UserPolls';
import ProfileEmail from '../ProfileEmail/ProfileEmail';
import ProfilePassword from '../ProfilePassword/ProfilePassword';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import '../../sass/Profile.scss';

axios.defaults.withCredentials = true;

interface IProfileStateProps {
  username:string,
  userId:string,
}
interface IProfileRouteProps extends RouteComponentProps {}
interface IProfileDispatchProps {
  logout: () => void,
}
type AllProps = IProfileRouteProps & IProfileStateProps & IProfileDispatchProps;

interface IProfileState {
  message:string,
  errorMessage:string,
}

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
    axios.delete('http://localhost:8080/api/user/profile', { data: { id: userId } })
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
      <div className="profile">
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        <section className="user-information">
          <h2 className="heading user-information__heading">User information</h2>
          <div className="user-information__elem">
            <p>
              Username:
              {}
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
          <div className="user-information__elem">
            <button type="button" onClick={this.handleDelete} className="btn btn--delete">Delete account</button>
          </div>
        </section>
        <UserPolls username={username} />
      </div>
    );
  }
}

const mapStateToProps = (state:AppState) => ({
  username: state.username,
  userId: state.userId,
});
const mapDispatchToProps = (dispatch:Dispatch<ActionTypes>) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
