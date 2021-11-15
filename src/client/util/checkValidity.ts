export default {
  checkPassword(password: string): string {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(
      password,
    )
      ? ''
      : 'Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character';
  },
  checkEmail(email: string): string {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    )
      ? ''
      : 'Email needs to be valid!';
  },
};
