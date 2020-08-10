import * as React from 'react';
import * as PropTypes from 'prop-types';
import '../../sass/Loader.scss';

interface ILoaderProps {
  size: string,
}
// default big small
const Loader:React.FunctionComponent<ILoaderProps> = ({ size }) => <div data-testid="loader" className={`loader${size !== 'default' ? `--${size}` : ''}`} />;

Loader.propTypes = {
  size: PropTypes.string.isRequired,
};

export default Loader;