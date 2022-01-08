import React from 'react';
import { Link } from 'react-router-dom';

import '../../sass/index.scss';

const NotFound = () => (
  <div className="not-found">
    <h1>404 - Not Found!</h1>
    <Link className="btn btn--bold" to="/">
      Go Home
    </Link>
  </div>
);

export default NotFound;
