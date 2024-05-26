import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { setCurrentUser } from '../../store/reducers/usersSlice';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = e.currentTarget;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    setErrorMessage('');
  };

  const handleSubmit = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    axios.post('/api/user/login', { username, password }).then(
      (res) => {
        if (res.data.success) {
          dispatch(setCurrentUser(res.data.sessionUser));
          navigate("/");
        }
      },
      (err) => {
        if (err.statusCode === 401) {
          setErrorMessage(err.response.data.message);
        }
        setErrorMessage(
          err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        );
      },
    );
  };

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
          onChange={handleChange}
          className="form__input"
        />

        <span className="form__notes"> </span>

        <label htmlFor="password" className="form__label">
          Password
          <FontAwesomeIcon
            icon={isPasswordVisible ? faEyeSlash : faEye}
            className="eye-icon"
            onClick={(): void =>
              setIsPasswordVisible(!isPasswordVisible)
            }
            title={
              isPasswordVisible ? 'Hide password!' : 'Show password!'
            }
          />
        </label>
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          name="password"
          id="password"
          onChange={handleChange}
          className="form__input"
        />
        <ErrorMessage>{errorMessage}</ErrorMessage>
        <button
          data-testid="login-btn"
          type="button"
          onClick={handleSubmit}
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
};

export default Login;
