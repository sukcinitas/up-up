import * as React from 'react';
import * as PropTypes from 'prop-types';

interface IErrorMessageProps {
  errorMessage:string,
};

const ErrorMessage: React.FunctionComponent<IErrorMessageProps> = ({ errorMessage }) => <div><p>{errorMessage}</p></div>;

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorMessage;
