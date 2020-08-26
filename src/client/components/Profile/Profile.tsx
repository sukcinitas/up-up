import * as React from 'react';
import * as PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { ActionTypes, logoutCurrentUser, AppState } from '../../redux/actions';
import UserPolls from '../UserPolls/UserPolls';
import StarredPolls from '../StarredPolls/StarredPolls';
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
  section:string,
}

class Profile extends React.Component<AllProps, IProfileState> {
  static propTypes: { username: PropTypes.Validator<string>; userId: PropTypes.Validator<string>;
    history: any; logout: PropTypes.Validator<(...args: any[]) => any>; };

  constructor(props:AllProps) {
    super(props);
    this.state = {
      message: '',
      errorMessage: '',
      section: 'info',
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.setSection = this.setSection.bind(this);
  }

  setSection(section) {
    this.setState({
      section,
    });
  }

  handleDelete() {
    const { history, userId, logout } = this.props;
    axios.delete('/api/user/profile', { data: { id: userId } })
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
    const { message, errorMessage, section } = this.state;
    if (message) {
      return <p>{message}</p>;
    }
    return (
      <div className="profile">
        <nav className="profile__navigation">
          <button
            className={`btn--nav ${section === 'info' ? 'btn--nav--selected' : ''}`}
            type="button"
            onClick={() => this.setSection('info')}
          >
            User information
          </button>
          <button
            className={`btn--nav ${section === 'user-polls' ? 'btn--nav--selected' : ''}`}
            type="button"
            onClick={() => this.setSection('user-polls')}
          >
            User polls
          </button>
          <button
            className={`btn--nav ${section === 'saved-polls' ? 'btn--nav--selected' : ''}`}
            type="button"
            onClick={() => this.setSection('saved-polls')}
          >
            Saved polls
          </button>
        </nav>
        { section === 'info'
          ? (
            <section className="user-information">
              {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
              <h2 className="heading user-information__heading" data-testid="info">User information</h2>
              <div className="user-information__elem">
                <p>
                  USERNAME:
                  {'  '}
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
          )
          : ''}
        {section === 'user-polls' ? <UserPolls username={username} /> : ''}
        {section === 'saved-polls' ? <StarredPolls /> : '' }
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
