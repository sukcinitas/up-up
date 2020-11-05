/* eslint-disable react/no-unused-state */
/* eslint-disable no-useless-escape */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { receiveCurrentUser, ActionTypes, AppState } from '../../redux/actions';
import checkValidity from '../../util/checkValidity';

axios.defaults.withCredentials = true;

interface IRegisterDispatchProps {
  register: (user:AppState) => void,
}
type AllProps = AppState & IRegisterDispatchProps;

interface IRegisterState {
  username:string,
  email:string,
  password:string,
  errorMessage:string,
  errors:{
    usernameErr:string,
    emailErr:string,
    passwordErr: string,
    usernameTaken:boolean,
    emailTaken:boolean
  },
  isPasswordVisible: boolean,
}

class Register extends React.Component<AllProps, IRegisterState> {
  static propTypes: { register: PropTypes.Validator<(...args: any[]) => any>; };

  constructor(props:AllProps) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      errorMessage: '',
      errors: {
        usernameErr: '',
        emailErr: '',
        passwordErr: '',
        usernameTaken: false,
        emailTaken: false,
      },
      isPasswordVisible: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    const { errors } = this.state;
    switch (e.currentTarget.name) {
      case 'username':
        errors.usernameErr = e.currentTarget.value.length < 5 || e.currentTarget.value.length > 30
          ? 'Username must be 5-30 characters long!'
          : '';
        break;
      case 'email':
        errors.emailErr = checkValidity.checkEmail(e.currentTarget.value);
        break;
      case 'password':
        errors.passwordErr = checkValidity.checkPassword(e.currentTarget.value);
        break;
      default: return;
    }
    switch (e.currentTarget.name) {
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
      default:
        this.setState({
          errors,
        });
    }
  }

  handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
    const {
      errors, username, email, password,
    } = this.state;
    e.preventDefault();
    const {
      usernameErr, emailErr, passwordErr,
    } = errors;
    const { register } = this.props;
    if (usernameErr !== '' || emailErr !== '' || passwordErr !== '') {
      return;
    }

    axios.post('/api/user/register', { username, email, password })
      .then((res) => {
        const newErrors = {
          ...errors,
          usernameTaken: res.data.username_taken || false,
          emailTaken: res.data.email_taken || false,
        };
        this.setState({
          errors: newErrors,
        }, () => {
          if (res.data.success) {
            register(res.data.sessionUser);
          }
        });
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  togglePasswordVisibility() {
    const { isPasswordVisible } = this.state;
    this.setState({
      isPasswordVisible: !isPasswordVisible,
    });
  }

  render() {
    const {
      errors, errorMessage, username, email, password, isPasswordVisible,
    } = this.state;
    const {
      usernameErr, emailErr, passwordErr, usernameTaken, emailTaken,
    } = errors;
    return (
      <div>
        <form className="form">

          <h1 className="heading form__heading">Register</h1>
          <label
            htmlFor="username"
            className="form__label"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={this.handleChange}
            className="form__input"
            required
            placeholder="Example: Vardenis"
          />
          <span className="form__notes">{` ${usernameErr}`}</span>

          <label
            htmlFor="email"
            className="form__label"
          >
            E-mail
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={this.handleChange}
            className="form__input"
            required
            placeholder="Example: vardenis@email.com"
          />
          <span className="form__notes">
            {' '}
            {emailErr}
          </span>

          <label
            htmlFor="password"
            className="form__label"
            title="Password must be at least 10 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character!"
          >
            Password
            <FontAwesomeIcon
              icon={isPasswordVisible ? ['far', 'eye-slash'] : ['far', 'eye']}
              className="eye-icon"
              onClick={this.togglePasswordVisibility}
              title={isPasswordVisible ? 'Hide password!' : 'Show password!'}
            />
          </label>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            name="password"
            id="password"
            onChange={this.handleChange}
            className="form__input"
            required
          />
          <span className="form__notes">
            {' '}
            {passwordErr}
          </span>

          <div>
            <span className="form__notes">
              {usernameTaken ? ' Username is already in use' : ''}
            </span>
            <span className="form__notes">{emailTaken ? ' Email is already in use' : ''}</span>
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
          </div>

          <button
            type="button"
            onClick={this.handleSubmit}
            className="btn btn--submit"
            disabled={!username || !email || !password}
          >
            Register
          </button>
          <span className="form__notes--additional">
            Already have an account?
            {' '}
            <Link to="/user/login" className="link form__link">Login</Link>
          </span>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch:Dispatch<ActionTypes>):IRegisterDispatchProps => ({
  register: (user:AppState) => dispatch(receiveCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(Register);
