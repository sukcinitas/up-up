import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import checkValidity from '../../util/checkValidity';

axios.defaults.withCredentials = true;

interface IProfileEmailProps {
  username:string,
  userId:string,
}

interface IProfileEmailState {
  newEmail:string,
  email:string,
  password:string,
  isChangingEmail:boolean,
  isLoading:boolean,
  errorMessage:string,
  changeErr:string,
}

class ProfileEmail extends React.Component<IProfileEmailProps, IProfileEmailState> {
  static propTypes: { username: PropTypes.Validator<string>; userId: PropTypes.Validator<string>; };

  constructor(props:IProfileEmailProps) {
    super(props);
    this.state = {
      newEmail: '',
      email: '',
      password: '',
      isChangingEmail: false,
      isLoading: true,
      errorMessage: '',
      changeErr: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.showEmailChange = this.showEmailChange.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.getEmail = this.getEmail.bind(this);
  }

  componentDidMount() {
    this.getEmail();
  }

  getEmail() {
    const { username } = this.props;
    axios.get(`/api/user/profile/${username}`)
      .then((res) => {
        if (res.data.success) {
          const { email } = res.data.user[0];
          this.setState({
            email,
            isLoading: false,
            newEmail: '',
            password: '',
          });
        }
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
          isLoading: false,
        });
      });
  }

  showEmailChange() {
    const { isChangingEmail } = this.state;
    this.setState({
      isChangingEmail: !isChangingEmail,
      errorMessage: '',
      changeErr: '',
    });
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.name === 'password') {
      this.setState({
        password: e.currentTarget.value,
        changeErr: '',
      });
    }
    if (e.currentTarget.name === 'newEmail') {
      this.setState({
        newEmail: e.currentTarget.value,
        changeErr: checkValidity.checkEmail(e.currentTarget.value),
      });
    }
  }

  changeEmail() {
    const { userId } = this.props;
    const {
      isChangingEmail, newEmail, password, changeErr,
    } = this.state;
    if (changeErr) {
      return;
    }
    axios.put('/api/user/profile', {
      parameter: 'email',
      id: userId,
      email: newEmail,
      password,
    }).then((res) => {
      if (res.data.success) {
        this.getEmail();
        this.setState({
          errorMessage: res.data.message,
          isChangingEmail: !isChangingEmail,
        });
      } else {
        this.setState({
          errorMessage: res.data.message,
          isLoading: false,
        });
      }
    })
      .catch((err) => {
        this.setState({
          changeErr: err.response.data.message || `${err.response.status}: ${err.response.statusText}`,
        });
      });
  }

  render() {
    const {
      newEmail, email, isChangingEmail, isLoading, errorMessage, password, changeErr,
    } = this.state;
    return (
      <div className="user-information__elem">
        <p>
          EMAIL:
          {'  '}
          {isLoading ? '...' : email}
        </p>
        <button type="button" data-testid="showEmailChange" onClick={this.showEmailChange} className="btn">Change email</button>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        {isChangingEmail
          ? (
            <div className="form form--user-information">
              <label className="form__label">New e-mail</label>
              <input value={newEmail} data-testid="newEmail" name="newEmail" onChange={this.handleChange} className="form__input" />
              <label className="form__label">Password</label>
              <input value={password} type="password" data-testid="password" name="password" onChange={this.handleChange} className="form__input" />
              <button type="button" onClick={this.changeEmail} className="btn btn--submit">Change</button>
              {changeErr && <ErrorMessage errorMessage={changeErr} />}
            </div>
          )
          : ''}
      </div>
    );
  }
}

export default ProfileEmail;
