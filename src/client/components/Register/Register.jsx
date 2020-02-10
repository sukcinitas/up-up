/* eslint-disable no-useless-escape */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { receiveCurrentUser } from '../../redux/actions';

axios.defaults.withCredentials = true;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      // eslint-disable-next-line react/no-unused-state
      confirmPassword: '', // it is used in input
      errors: {
        usernameErr: '',
        emailErr: '',
        passwordErr: '',
        passwordsMatch: true,
        usernameTaken: false,
        emailTaken: false,
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { errors, password } = this.state;
    switch (e.target.name) {
      case 'username':
        errors.usernameErr = e.target.value.length < 5 || e.target.value.length > 30
          ? 'username must be 5-30 characters long'
          : '';
        break;
      case 'email':
        errors.emailErr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.target.value)
          ? '' : 'email is not valid';
        break;
      case 'password':
        errors.passwordErr = e.target.value.length < 6 ? 'password must be at least 6 characters long' : '';
        break;
      case 'confirmPassword':
        errors.passwordsMatch = password === e.target.value ? '' : 'passwords should match';
        break;
      default: return;
    }
    this.setState({
      errors,
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    const {
      errors, username, email, password,
    } = this.state;
    e.preventDefault();
    const {
      usernameErr, emailErr, passwordErr, passwordsMatch,
    } = errors;
    const { register } = this.props;
    if (usernameErr !== '' || emailErr !== '' || passwordErr !== '' || passwordsMatch !== '') {
      return;
    }
    const user = {
      username,
      email,
      password,
    };

    axios('http://localhost:8080/api/user/register',
      {
        method: 'post',
        data: user,
      })
      .then((res) => {
        const newErrors = {
          ...errors,
          usernameTaken: res.data.username_taken || false,
          emailTaken: res.data.email_taken || false,
        };
        this.setState({
          errors: newErrors,
        }, () => {
          if (res.data.redirect) {
            register(res.data.sessionUser);
          }
        });
      });
  }

  render() {
    const { errors } = this.state;
    const {
      usernameErr, emailErr, passwordErr, passwordsMatch, usernameTaken, emailTaken,
    } = errors;
    return (
      <form className="form">
        <h1>Register</h1>

        <label
          htmlFor="username"
          className="label"
        >
          Username
          <span className="notes">{` ${usernameErr}`}</span>
        </label>
        <input
          type="text"
          name="username"
          onChange={this.handleChange}
          className="input"
          required
        />

        <label
          htmlFor="email"
          className="label"
        >
          E-mail
          <span className="notes">
            {' '}
            {emailErr}
          </span>
        </label>
        <input
          type="email"
          name="email"
          onChange={this.handleChange}
          className="input"
          required
        />

        <label
          htmlFor="password"
          className="label"
        >
          Password
          <span className="notes">
            {' '}
            {passwordsMatch}
          </span>
          <span className="notes">
            {' '}
            {passwordErr}
          </span>
        </label>
        <input
          type="password"
          name="password"
          onChange={this.handleChange}
          className="input"
          required
        />

        <label
          htmlFor="confirmPassword"
          className="label"
        >
          Repeat Password
          {' '}
          <span className="notes">
            {' '}
            {passwordsMatch}
          </span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          onChange={this.handleChange}
          className="input"
          required
        />

        <div>
          <span className="notes">
            {usernameTaken ? ' username is already in use' : ''}
          </span>
          <span className="notes">{emailTaken ? ' email is already in use' : ''}</span>
        </div>

        <button type="button" onClick={this.handleSubmit} className="label">Register</button>
        <span>
          Already have an account?
          <Link to="/user/login">Login</Link>
        </span>
      </form>

    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  register: (user) => dispatch(receiveCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(Register);
