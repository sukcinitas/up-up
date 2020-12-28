import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AppState, logoutCurrentUser } from '../../redux/actions';
import UserPolls from '../UserPolls/UserPolls';
import StarredPolls from '../StarredPolls/StarredPolls';
import ProfileEmail from '../ProfileEmail/ProfileEmail';
import ProfilePassword from '../ProfilePassword/ProfilePassword';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import '../../sass/Profile.scss';

axios.defaults.withCredentials = true;

const Profile: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { username, userId } = useSelector((state: AppState) => ({
    username: state.username,
    userId: state.userId,
  }));
  const history = useHistory();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [section, setSection] = useState('info');
  const [
    isDeletionConfirmationVisible,
    setIsDeletionConfirmationVisible,
  ] = useState(false);

  const toggleConfirmation = (state: string): void => {
    if (state === 'close') {
      setIsDeletionConfirmationVisible(false);
      setErrorMessage('');
    } else if (state === 'open') {
      setIsDeletionConfirmationVisible(true);
      setErrorMessage('');
    }
  };

  const handleDelete = () => {
    axios
      .delete('/api/user/profile', { data: { id: userId, username } })
      .then(
        (res) => {
          if (res.data.success) {
            setMessage('User has been successfully deleted!');
            setTimeout(() => {
              dispatch(logoutCurrentUser());
              history.push('/');
            }, 1000);
          }
        },
        (err) => {
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
          onClick={() => setSection('info')}
        >
          User information
        </button>
        <button
          className={`btn--nav ${
            section === 'user-polls' ? 'btn--nav--selected' : ''
          }`}
          type="button"
          onClick={() => setSection('user-polls')}
        >
          User polls
        </button>
        <button
          className={`btn--nav ${
            section === 'saved-polls' ? 'btn--nav--selected' : ''
          }`}
          type="button"
          onClick={() => setSection('saved-polls')}
        >
          Saved polls
        </button>
      </nav>
      {section === 'info' ? (
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
            <p>
              USERNAME:
              {'  '}
              {username}
            </p>
          </div>
          <ProfileEmail username={username} userId={userId} />
          <ProfilePassword username={username} userId={userId} />
          <div className="user-information__elem">
            <button
              type="button"
              onClick={() => toggleConfirmation('open')}
              className="btn btn--delete"
            >
              Delete account
            </button>
            {isDeletionConfirmationVisible ? (
              <div className="form form--user-information">
                <p className="form__subheading">
                  {' '}
                  Are you sure you want to delete your account?
                </p>
                <div className="form__wrapper">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn--submit"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleConfirmation('close')}
                    className="btn btn--submit"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </section>
      ) : (
        ''
      )}
      {section === 'user-polls' ? (
        <UserPolls username={username} />
      ) : (
        ''
      )}
      {section === 'saved-polls' ? <StarredPolls /> : ''}
    </div>
  );
};

export default Profile;
