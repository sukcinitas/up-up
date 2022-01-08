import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import checkValidity from '../../util/checkValidity';

axios.defaults.withCredentials = true;

type TProfilePasswordProps = {
  username: string;
  userId: string;
};

const ProfilePassword = ({
  username,
  userId,
}: TProfilePasswordProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [changeErr, setChangeErr] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = e.currentTarget;
    if (name === 'newPassword') {
      setNewPassword(value);
      setChangeErr(checkValidity.checkPassword(value));
    }
    if (name === 'oldPassword') {
      setOldPassword(value);
      setMessage('');
    }
  };

  const showPasswordChange = (): void => {
    setIsChangingPassword(!isChangingPassword);
    setMessage('');
    setChangeErr('');
  };

  const changePassword = (e: React.FormEvent): void => {
    if (changeErr) {
      return;
    }
    e.preventDefault();
    axios
      .put('/api/user/profile', {
        parameter: 'password',
        id: userId,
        username,
        oldpassword: oldPassword,
        newpassword: newPassword,
      })
      .then((res) => {
        if (res.data.success) {
          setMessage(res.data.message);
          setIsChangingPassword(false);
          setChangeErr('');
          setNewPassword('');
          setOldPassword('');
        } else {
          setChangeErr(res.data.message);
          setNewPassword('');
          setOldPassword('');
        }
      })
      .catch((err) => {
        setChangeErr(
          err.response.data.message ||
            `${err.response.status}: ${err.response.statusText}`,
        );
        setNewPassword('');
        setOldPassword('');
      });
  };

  const togglePasswordVisibility = (): void => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="user-information__elem">
      <button
        type="button"
        onClick={showPasswordChange}
        className="btn btn--accent"
      >
        Change password
      </button>
      {message && <ErrorMessage>{message}</ErrorMessage>}
      {isChangingPassword && (
        <form className="form form--user-information">
          <label className="form__label">Old password</label>
          <input
            type="password"
            data-testid="oldPassword"
            value={oldPassword}
            name="oldPassword"
            onChange={handleChange}
            className="form__input"
          />
          <label className="form__label">
            New password
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              className="eye-icon"
              onClick={togglePasswordVisibility}
              title={
                isPasswordVisible
                  ? 'Hide password!'
                  : 'Show password!'
              }
            />
          </label>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            data-testid="newPassword"
            value={newPassword}
            name="newPassword"
            onChange={handleChange}
            className="form__input"
          />
          <button
            type="submit"
            onClick={changePassword}
            className="btn btn--submit"
          >
            Change
          </button>
          {changeErr && <ErrorMessage>{changeErr}</ErrorMessage>}
        </form>
      )}
    </div>
  );
};

ProfilePassword.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default ProfilePassword;
