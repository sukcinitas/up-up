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
      message: '',
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
      });
  }

  render() {
    const { username, userId } = this.props;
    const { message } = this.state;
    if (message) {
      return <p>{message}</p>;
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

const mapStateToProps = (state) => ({
  username: state.username,
  userId: state.userId,
});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logoutCurrentUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
