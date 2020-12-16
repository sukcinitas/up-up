import * as React from 'react';

const ErrorMessage: React.FunctionComponent = ({ children }) => (
  <span className="form__notes form__notes--profile">{children}</span>
);

export default ErrorMessage;
