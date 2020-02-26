import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { connect } from 'react-redux';
import { receiveCurrentUser } from '../../redux/actions';
import ErrorMessage from '../ErrorMessage/ErrorMessage.jsx';

axios.defaults.withCredentials = true;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    const { username, password } = this.state;
    const { login } = this.props;
    e.preventDefault();
    axios.post('http://localhost:8080/api/user/login', { username, password })
      .then((res) => {
        if (res.data.isAuthenticated) {
          login(res.data.sessionUser);
        } else {
          this.setState({ errorMessage: res.data.error });
        }
      });
  }

  render() {
    const { errorMessage } = this.state;
    return (
      <form className="form">

        <h1>Login</h1>

        <label
          htmlFor="username"
          className="label"
        >
          Username
        </label>
        <input type="text" name="username" id="username" onChange={this.handleChange} className="input" />

        <label
          htmlFor="password"
          className="label"
        >
          Password
        </label>
        <input type="password" name="password" id="password" onChange={this.handleChange} className="input" />

        <button data-testid="login-btn" type="button" onClick={this.handleSubmit} className="label">Login</button>

        <ErrorMessage errorMessage={errorMessage} />

        <span>
          Do not have an account?
          <Link to="/user/register">Register</Link>
        </span>

      </form>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapDispathToProps = (dispatch) => ({
  login: (user) => dispatch(receiveCurrentUser(user)),
});

export default connect(null, mapDispathToProps)(Login);
