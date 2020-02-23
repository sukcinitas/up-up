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
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { oldPassword, newPassword } = this.state;
    const {
      message, isChangingPassword, changePassword, showPasswordChange,
    } = this.props;
    return (
      <div>
        <button type="button" onClick={showPasswordChange}>Change password</button>
        {message ? <span>{message}</span> : ''}
        {isChangingPassword
          ? (
            <div>
              Old password:
              {' '}
              <input value={oldPassword} name="oldPassword" onChange={this.handleChange} />
              New password:
              <input value={newPassword} name="newPassword" onChange={this.handleChange} />
              <button type="button" onClick={() => changePassword(oldPassword, newPassword)}>Change password</button>
            </div>
          )
          : ''}
      </div>
    );
  }
}

ProfilePassword.propTypes = {
  message: PropTypes.string.isRequired,
  isChangingPassword: PropTypes.bool.isRequired,
  changePassword: PropTypes.func.isRequired,
  showPasswordChange: PropTypes.func.isRequired,
};

export default ProfilePassword;
