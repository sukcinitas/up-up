import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  receiveCurrentUser,
  AppState,
  ActionTypes,
} from '../../redux/actions';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

axios.defaults.withCredentials = true;

interface ILoginDispatchProps {
  login: (user: AppState) => void;
}

type AllProps = AppState & ILoginDispatchProps;

interface ILoginState {
  username: string;
  password: string;
  errorMessage: string;
}

class Login extends React.Component<AllProps, ILoginState> {
  static propTypes: {
    login: PropTypes.Validator<(...args: any[]) => any>;
  };

  constructor(props: AllProps) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.name === 'username') {
      this.setState({
        username: e.currentTarget.value,
        errorMessage: '',
      });
    }
    if (e.currentTarget.name === 'password') {
      this.setState({
        password: e.currentTarget.value,
        errorMessage: '',
      });
    }
  }

  handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const { username, password } = this.state;
    const { login } = this.props;
    e.preventDefault();
    axios
      .post('/api/user/login', { username, password })
      .then((res) => {
        if (res.data.success) {
          login(res.data.sessionUser);
        } else {
          this.setState({
            errorMessage: res.data.message,
          });
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage:
            err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  render() {
    const { errorMessage, username, password } = this.state;
    return (
      <div>
        <form className="form">
          <h1 className="heading">Login</h1>
          <label htmlFor="username" className="form__label">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={this.handleChange}
            className="form__input"
          />

          <span className="form__notes"> </span>

          <label htmlFor="password" className="form__label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={this.handleChange}
            className="form__input"
          />
          <ErrorMessage errorMessage={errorMessage} />
          <button
            data-testid="login-btn"
            type="button"
            onClick={this.handleSubmit}
            className="btn btn--submit"
            disabled={!username || !password}
          >
            Login
          </button>

          <span className="form__notes form__notes--additional">
            Do not have an account?{' '}
            <Link to="/user/register" className="link form__link">
              Register
            </Link>
          </span>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({
  login: (user: AppState) => dispatch(receiveCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(Login);
