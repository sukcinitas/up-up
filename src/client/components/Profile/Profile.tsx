import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import { logoutCurrentUser } from '../../store/reducers/usersSlice';
import UserPolls from '../UserPolls/UserPolls';
import StarredPolls from '../StarredPolls/StarredPolls';
import ProfileEmail from '../ProfileEmail/ProfileEmail';
import ProfilePassword from '../ProfilePassword/ProfilePassword';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import '../../sass/Profile.scss';
import { RootState } from '../../store';

axios.defaults.withCredentials = true;

const Profile = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.users.username);
  const userId = useSelector((state: RootState) => state.users.userId);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [changeErr, setChangeErr] = useState('');
  const [section, setSection] = useState('info');
  const [
    isDeletionConfirmationVisible,
    setIsDeletionConfirmationVisible,
  ] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleConfirmation = (): void => {
    setIsDeletionConfirmationVisible(!isDeletionConfirmationVisible);
    setErrorMessage('');
  };

  const handleDelete = (): void => {
    axios
      .delete('/api/user/profile', {
        data: { id: userId, username, password },
      })
      .then(
        (res) => {
          if (res.data.success) {
            setMessage('User has been successfully deleted!');
            setChangeErr('');
            setTimeout(() => {
              dispatch(logoutCurrentUser());
              navigate('/');
            }, 1000);
          }
        },
        (err) => {
          if (err.response.status && err.response.status === 401) {
            setChangeErr(err.response.data.message);
            return;
          }
          setErrorMessage(
            err.response.data.message ||
              `${err.response.status}: ${err.response.statusText}`,
          );
        },
      );
  };

  if (message) {
    return <p>{message}</p>;
  }
  return (
    <div className="profile">
      <nav className="profile__navigation">
        <button
          className={`btn--nav ${
            section === 'info' ? 'btn--nav--selected' : ''
          }`}
          type="button"
          onClick={(): void => setSection('info')}
        >
          User information
        </button>
        <button
          className={`btn--nav ${
            section === 'user-polls' ? 'btn--nav--selected' : ''
          }`}
          type="button"
          onClick={(): void => setSection('user-polls')}
        >
          User polls
        </button>
        <button
          className={`btn--nav ${
            section === 'saved-polls' ? 'btn--nav--selected' : ''
          }`}
          type="button"
          onClick={(): void => setSection('saved-polls')}
        >
          Saved polls
        </button>
      </nav>
      {section === 'info' && (
        <section className="user-information">
          {errorMessage && (
            <ErrorMessage>{errorMessage}</ErrorMessage>
          )}
          <h2
            className="heading user-information__heading"
            data-testid="info"
          >
            User information
          </h2>
          <div className="user-information__elem">
            <p data-testid="user">
              <b>Username:</b> <span>{username}</span>
            </p>
          </div>
          <ProfileEmail username={username} userId={userId} />
          <ProfilePassword username={username} userId={userId} />
          <div className="user-information__elem">
            <button
              type="button"
              onClick={(): void => toggleConfirmation()}
              className="btn btn--delete"
            >
              Delete account
            </button>
            {isDeletionConfirmationVisible && (
              <form className="form form--user-information">
                <label className="form__label">
                  Enter password to delete account
                  <FontAwesomeIcon
                    icon={isPasswordVisible ? faEyeSlash : faEye}
                    className="eye-icon"
                    onClick={() =>
                      setIsPasswordVisible(!isPasswordVisible)
                    }
                    title={
                      isPasswordVisible
                        ? 'Hide password!'
                        : 'Show password!'
                    }
                  />
                </label>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="form__input"
                />
                <div className="form__wrapper">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn--delete"
                  >
                    Confirm
                  </button>
                </div>
                {changeErr && (
                  <ErrorMessage>{changeErr}</ErrorMessage>
                )}
              </form>
            )}
          </div>
        </section>
      )}
      {section === 'user-polls' && <UserPolls username={username} />}
      {section === 'saved-polls' && <StarredPolls />}
    </div>
  );
};

export default Profile;
