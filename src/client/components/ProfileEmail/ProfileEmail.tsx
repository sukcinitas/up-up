import * as React from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

axios.defaults.withCredentials = true;

interface IProfileEmailProps {
  username:string,
  userId:string,
};

interface IProfileEmailState {
  newEmail:string,
  email:string,
  isChangingEmail:boolean,
  isLoading:boolean,
  errorMessage:string,
};

class ProfileEmail extends React.Component<IProfileEmailProps, IProfileEmailState> {
  static propTypes: { username: PropTypes.Validator<string>; userId: PropTypes.Validator<string>; };
  constructor(props:IProfileEmailProps) {
    super(props);
    this.state = {
      newEmail: '',
      email: '',
      isChangingEmail: false,
      isLoading: true,
      errorMessage: '',
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
    axios.get(`http://localhost:8080/api/user/profile/${username}`)
      .then((res) => {
        const { email } = res.data.user[0];
        this.setState({
          email,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: `Error: ${error.response.status}: ${error.response.statusText}`,
        });
      });
  }

  showEmailChange() {
    const { isChangingEmail } = this.state;
    this.setState({ isChangingEmail: !isChangingEmail });
  }

  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    this.setState({ 
      newEmail: e.currentTarget.value, 
    });
  }

  changeEmail() {
    const { userId } = this.props;
    const { isChangingEmail, newEmail } = this.state;
    axios.put('http://localhost:8080/api/user/profile', {
      parameter: 'email',
      id: userId,
      email: newEmail,
    }).then((res) => {
      this.getEmail();
      this.setState({
        errorMessage: res.data.message,
        isChangingEmail: !isChangingEmail,
      });
    });
  }

  render() {
    const {
      newEmail, email, isChangingEmail, isLoading, errorMessage,
    } = this.state;
    return (
      <div className="user-information__elem">
        <p>
          Email:
          {isLoading ? 'Loading...' : email}
        </p>
        <button type="button" data-testid="showEmailChange" onClick={this.showEmailChange} className="btn">Change email</button>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
        {isChangingEmail
          ? (
            <div className="form form--user-information">
              <label className="form__label">New e-mail</label>
              <input value={newEmail} data-testid="newEmail" name="newEmail" onChange={this.handleChange} className="form__input"/>
              <button type="button" onClick={this.changeEmail} className="btn btn--submit">Change</button>
            </div>
          )
          : ''}
      </div>
    );
  }
}

export default ProfileEmail;
