import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

axios.defaults.withCredentials = true;

class ProfileEmail extends React.Component {
  constructor() {
    super();
    this.state = {
      newEmail: '',
      email: '',
      isChangingEmail: false,
      isLoading: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.showEmailChange = this.showEmailChange.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.getEmail = this.getEmail.bind(this);
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

  showEmailChange() {
    const { isChangingEmail } = this.state;
    this.setState({ isChangingEmail: !isChangingEmail });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeEmail(newEmail) {
    const { userId } = this.props;
    const { isChangingEmail } = this.state;
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
        message: res.data.message,
        isChangingEmail: !isChangingEmail,
      });
    });
  }

  render() {
    const {
      newEmail, email, message, isChangingEmail, isLoading,
    } = this.state;
    return (
      <div>
        <p>
          Email:
          {isLoading ? 'Loading...' : email}
        </p>
        <button type="button" data-testid="showEmailChange" onClick={this.showEmailChange}>Change email</button>
        {message ? <span>{message}</span> : ''}
        {isChangingEmail
          ? (
            <div>
              <input value={newEmail} data-testid="newEmail" name="newEmail" onChange={this.handleChange} />
              <button type="button" onClick={this.changeEmail}>Change</button>
            </div>
          )
          : ''}
      </div>
    );
  }
}

ProfileEmail.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default ProfileEmail;
