import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <span className="form__notes form__notes--profile">{children}</span>
);

ErrorMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorMessage;
