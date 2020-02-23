import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

axios.defaults.withCredentials = true;

class ProfileEmail extends React.Component {
  constructor() {
    super();
    this.state = {
      newEmail: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { newEmail } = this.state;
    const {
      email, message, changeEmail, isChangingEmail, showEmailChange,
    } = this.props;
    return (
      <div>
        <p>
          Email:
          {email}
        </p>
        <button type="button" onClick={showEmailChange}>Change email</button>
        {message ? <span>{message}</span> : ''}
        {isChangingEmail
          ? (
            <div>
              <input value={newEmail} name="newEmail" onChange={this.handleChange} />
              <button type="button" onClick={() => changeEmail(newEmail)}>Change</button>
            </div>
          )
          : ''}
      </div>
    );
  }
}

ProfileEmail.propTypes = {
  email: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  changeEmail: PropTypes.func.isRequired,
  showEmailChange: PropTypes.func.isRequired,
  isChangingEmail: PropTypes.bool.isRequired,
};

export default ProfileEmail;
