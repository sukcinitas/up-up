import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ errorMessage }) => <div><p>{errorMessage}</p></div>;

ErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorMessage;
