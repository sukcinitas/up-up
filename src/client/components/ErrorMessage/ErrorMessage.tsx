import * as React from 'react';
import * as PropTypes from 'prop-types';

const ErrorMessage: React.FunctionComponent = ({ children }) => (
  <span className="form__notes form__notes--profile">{children}</span>
);

ErrorMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorMessage;
