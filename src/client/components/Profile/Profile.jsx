import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { logoutCurrentUser } from '../../redux/actions';
import UserPolls from '../UserPolls/UserPolls.jsx';
import ProfileEmail from '../ProfileEmail/ProfileEmail.jsx';
import ProfilePassword from '../ProfilePassword/ProfilePassword.jsx';

axios.defaults.withCredentials = true;

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      isChangingPassword: false,
      isChangingEmail: false,
      message: {
        emailChange: '',
        passwordChange: '',
        accountDelete: '',
      },
      isLoading: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.showPasswordChange = this.showPasswordChange.bind(this);
    this.showEmailChange = this.showEmailChange.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.getEmail();
  }

  getEmail() {
    const { username } = this.props;
    axios.get(`http://localhost:8080/api/user/profile/${username}`)
      .then((res) => {
        const { email } = res.data.user[0];
        this.setState({
          email,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  showPasswordChange() {
    this.setState({ isChangingPassword: true });
  }

  showEmailChange() {
    const { isChangingEmail } = this.state;
    this.setState({ isChangingEmail: !isChangingEmail });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeEmail(newEmail) {
    const { userId } = this.props;
    axios('http://localhost:8080/api/user/profile', {
      method: 'put',
      data: {
        parameter: 'email',
        id: userId,
        email: newEmail,
      },
    }).then((res) => {
      this.getEmail();
      this.setState({
        message: {
          emailChange: res.data.message,
        },
        isChangingEmail: false,
      });
    });
  }

  changePassword(oldPassword, newPassword) {
    const { username, userId } = this.props;
    axios('http://localhost:8080/api/user/profile', {
      method: 'put',
      data: {
        parameter: 'password',
        id: userId,
        username,
        oldpassword: oldPassword,
        newpassword: newPassword,
      },
    }).then((res) => {
      this.setState({
        message: {
          passwordChange: res.data.message,
        },
        isChangingPassword: false,
      });
    });
  }

  handleDelete() {
    const { history, userId, logout } = this.props;
    axios('http://localhost:8080/api/user/profile',
      {
        method: 'delete',
        data: { id: userId },
      })
      .then(() => {
        logout();
        history.push('/');
      });
  }

  render() {
    const {
      email, message, isChangingPassword,
      isLoading, isChangingEmail,
    } = this.state;
    const { username } = this.props;
    if (isLoading) {
      return <p>Loading...</p>;
    }
    return (
      <div>
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
              email={email}
              message={message.emailChange}
              changeEmail={this.changeEmail}
              isChangingEmail={isChangingEmail}
              showEmailChange={this.showEmailChange}
            />
            <ProfilePassword
              message={message.passwordChange}
              changePassword={this.changePassword}
              isChangingPassword={isChangingPassword}
              showPasswordChange={this.showPasswordChange}
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

const mapStateToProps = (state) => ({
  username: state.username,
  userId: state.userId,
});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
