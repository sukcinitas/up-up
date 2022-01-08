import React from 'react';
import PropTypes from 'prop-types';
import '../../sass/Loader.scss';

// available size options: default, big, small
const Loader = ({ size }: { size: string }) => (
  <div
    data-testid="loader"
    className={`loader ${
      size !== 'default' ? `loader--${size}` : ''
    }`}
  />
);

Loader.propTypes = {
  size: PropTypes.string.isRequired,
};

export default Loader;
