import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

axios.defaults.withCredentials = true;

interface IProfilePasswordProps {
  username:string,
  userId:string,
}

interface IProfilePasswordState {
  newPassword:string,
  oldPassword:string,
  isChangingPassword:boolean,
  message:string,
}

class ProfilePassword extends React.Component<IProfilePasswordProps, IProfilePasswordState> {
  static propTypes: { username: PropTypes.Validator<string>; userId: PropTypes.Validator<string>; };

  constructor(props:IProfilePasswordProps) {
    super(props);
    this.state = {
      newPassword: '',
      oldPassword: '',
      isChangingPassword: false,
      message: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.showPasswordChange = this.showPasswordChange.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.name === 'newPassword') {
      this.setState({
        newPassword: e.currentTarget.value,
        message: '',
      });
    }
    if (e.currentTarget.name === 'oldPassword') {
      this.setState({
        oldPassword: e.currentTarget.value,
        message: '',
      });
    }
  }

  showPasswordChange() {
    const { isChangingPassword } = this.state;
    this.setState({
      isChangingPassword: !isChangingPassword,
      message: '',
    });
  }

  changePassword() {
    const { username, userId } = this.props;
    const { oldPassword, newPassword } = this.state;
    axios.put('/api/user/profile', {
      parameter: 'password',
      id: userId,
      username,
      oldpassword: oldPassword,
      newpassword: newPassword,
    }).then((res) => {
      this.setState({
        message: res.data.message,
        isChangingPassword: res.data.message === 'Password is incorrect!',
      });
    });
  }

  render() {
    const {
      oldPassword, newPassword, message, isChangingPassword,
    } = this.state;
    return (
      <div className="user-information__elem">
        <button type="button" onClick={this.showPasswordChange} className="btn btn--user">Change password</button>
        {message && <ErrorMessage errorMessage={message} />}
        {isChangingPassword
          ? (
            <div className="form form--user-information">
              <label className="form__label">Old password</label>
              <input type="password" data-testid="oldPassword" value={oldPassword} name="oldPassword" onChange={this.handleChange} className="form__input" />
              <label className="form__label">New password</label>
              <input type="password" data-testid="newPassword" value={newPassword} name="newPassword" onChange={this.handleChange} className="form__input" />
              <button type="button" onClick={this.changePassword} className="btn btn--submit">Change</button>
            </div>
          )
          : ''}
      </div>
    );
  }
}

export default ProfilePassword;
