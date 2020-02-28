/* eslint-disable no-useless-escape */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { receiveCurrentUser, ActionTypes, AppState } from '../../redux/actions';

axios.defaults.withCredentials = true;

interface IRegisterDispatchProps {
  register: (user:string) => void,
};

interface IRegisterState {
  username:string,
  email:string,
  password:string,
  confirmPassword:string, 
  errors:{
    usernameErr:string,
    emailErr:string,
    passwordErr: string,
    passwordsMatch:string,
    usernameTaken:boolean,
    emailTaken:boolean,
};

class Register extends React.Component<IRegisterDispatchProps, IRegisterState> {
  static propTypes: { register: PropTypes.Validator<(...args: any[]) => any>; };
  constructor(props:IRegisterDispatchProps) {
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
        passwordsMatch: '',
        usernameTaken: false,
        emailTaken: false,
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    const { errors, password } = this.state;
    switch (e.currentTarget.name) {
      case 'username':
        errors.usernameErr = e.currentTarget.value.length < 5 || e.currentTarget.value.length > 30
          ? 'username must be 5-30 characters long'
          : '';
        break;
      case 'email':
        errors.emailErr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e.currentTarget.value)
          ? '' : 'email is not valid';
        break;
      case 'password':
        errors.passwordErr = e.currentTarget.value.length < 6 ? 'password must be at least 6 characters long' : '';
        break;
      case 'confirmPassword':
        errors.passwordsMatch = password === e.currentTarget.value ? '' : 'passwords should match';
        break;
      default: return;
    }
    switch(e.currentTarget.name){
        case 'username':
          this.setState({
            errors,
            username: e.currentTarget.value,
          });
          break;
        case 'email':
          this.setState({
            errors,
            email: e.currentTarget.value,
          });
          break;
        case 'password':
          this.setState({
            errors,
            password: e.currentTarget.value,
          });
          break;
        case 'confirmPassword':
          this.setState({
            errors,
            confirmPassword: e.currentTarget.value,
          });
          break;
      }
  }

  handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
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
        </label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={this.handleChange}
          className="input"
          required
        />
        <span className="notes">{` ${usernameErr}`}</span>

        <label
          htmlFor="email"
          className="label"
        >
          E-mail
        </label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={this.handleChange}
          className="input"
          required
        />
        <span className="notes">
          {' '}
          {emailErr}
        </span>

        <label
          htmlFor="password"
          className="label"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={this.handleChange}
          className="input"
          required
        />
        <span className="notes">
          {' '}
          {passwordErr}
        </span>

        <label
          htmlFor="confirmPassword"
          className="label"
        >
          Repeat Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          onChange={this.handleChange}
          className="input"
          required
        />
        {' '}
        <span className="notes">
          {' '}
          {passwordsMatch}
        </span>

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

const mapDispatchToProps = (dispatch:Dispatch<ActionTypes>) => ({
  register: (user:AppState) => dispatch(receiveCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(Register);
