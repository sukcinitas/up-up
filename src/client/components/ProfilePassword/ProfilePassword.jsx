import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

axios.defaults.withCredentials = true;

class ProfilePassword extends React.Component {
  constructor() {
    super();
    this.state = {
      newPassword: '',
      oldPassword: '',
      isChangingPassword: false,
      message: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.showPasswordChange = this.showPasswordChange.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  showPasswordChange() {
    const { isChangingPassword } = this.state;
    this.setState({ isChangingPassword: !isChangingPassword });
  }

  changePassword() {
    const { username, userId } = this.props;
    const { oldPassword, newPassword } = this.state;
    axios.put('http://localhost:8080/api/user/profile', {
      parameter: 'password',
      id: userId,
      username,
      oldpassword: oldPassword,
      newpassword: newPassword,
    }).then((res) => {
      this.setState({
        message: res.data.message,
        isChangingPassword: res.data.message === 'Password is incorrect!',
      });
    });
  }

  render() {
    const {
      oldPassword, newPassword, message, isChangingPassword,
    } = this.state;
    return (
      <div>
        <button type="button" onClick={this.showPasswordChange}>Change password</button>
        {message ? <span>{message}</span> : ''}
        {isChangingPassword
          ? (
            <div>
              Old password:
              {' '}
              <input data-testid="oldPassword" value={oldPassword} name="oldPassword" onChange={this.handleChange} />
              New password:
              <input data-testid="newPassword" value={newPassword} name="newPassword" onChange={this.handleChange} />
              <button type="button" onClick={this.changePassword}>Change</button>
            </div>
          )
          : ''}
      </div>
    );
  }
}

ProfilePassword.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default ProfilePassword;
