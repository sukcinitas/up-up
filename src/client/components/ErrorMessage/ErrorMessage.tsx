import * as React from 'react';
import * as PropTypes from 'prop-types';

interface IErrorMessageProps {
  errorMessage: string;
}

const ErrorMessage: React.FunctionComponent<IErrorMessageProps> = ({
  errorMessage,
}) => (
  <span className="form__notes form__notes--profile">
    {errorMessage}
  </span>
);

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorMessage;
