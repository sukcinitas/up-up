import * as React from 'react';
import { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import checkValidity from '../../util/checkValidity';

axios.defaults.withCredentials = true;

interface IProfileEmailProps {
  username: string;
  userId: string;
}

const ProfileEmail: React.FunctionComponent<IProfileEmailProps> = ({
  username,
  userId,
}) => {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [changeErr, setChangeErr] = useState('');

  useEffect(() => {
    const getEmail = () => {
      setIsLoading(true);
      axios
        .get(`/api/user/profile/${username}`)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.user[0].email;
            setEmail(data);
            setIsLoading(false);
            setNewEmail('');
            setPassword('');
          }
        })
        .catch((err) => {
          setErrorMessage(
            err.response.data.message ||
              `${err.response.status}: ${err.response.statusText}`,
          );
          setIsLoading(false);
        });
    };
    getEmail();
  }, [username]);

  const showEmailChange = () => {
    setIsChangingEmail(!isChangingEmail);
    setErrorMessage('');
    setChangeErr('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (name === 'password') {
      setPassword(value);
      setChangeErr('');
    }
    if (name === 'newEmail') {
      setNewEmail(value);
      setChangeErr(checkValidity.checkEmail(value));
    }
  };

  const changeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeErr) {
      return;
    }
    axios
      .put('/api/user/profile', {
        parameter: 'email',
        id: userId,
        email: newEmail,
        password,
      })
      .then((res) => {
        if (res.data.success) {
          setEmail(newEmail);
          setNewEmail('');
          setPassword('');
          setErrorMessage(res.data.message);
          setIsChangingEmail(false);
        } else {
          setErrorMessage(res.data.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setChangeErr(
          err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        );
      });
  };

  return (
    <div className="user-information__elem">
      <p>
        EMAIL:
        {'  '}
        {isLoading ? '...' : email}
      </p>
      <button
        type="button"
        data-testid="showEmailChange"
        onClick={showEmailChange}
        className="btn"
      >
        Change email
      </button>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {isChangingEmail ? (
        <form className="form form--user-information">
          <label className="form__label">New e-mail</label>
          <input
            value={newEmail}
            data-testid="newEmail"
            name="newEmail"
            onChange={handleChange}
            className="form__input"
          />
          <label className="form__label">Password</label>
          <input
            value={password}
            type="password"
            data-testid="password"
            name="password"
            onChange={handleChange}
            className="form__input"
          />
          <button
            type="submit"
            onClick={changeEmail}
            className="btn btn--submit"
          >
            Change
          </button>
          {changeErr && <ErrorMessage>{changeErr}</ErrorMessage>}
        </form>
      ) : (
        ''
      )}
    </div>
  );
};

ProfileEmail.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default ProfileEmail;
