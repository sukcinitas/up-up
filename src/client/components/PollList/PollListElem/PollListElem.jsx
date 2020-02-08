import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PollListElem.css';

const PollListElem = ({
  id, name, votes, createdBy, updatedAt,
}) => (
  <div className="poll-list__elem">
    <Link to={`/polls/${id}`}>
      <h2>{name}</h2>
    </Link>
    <div className="details">
      <p className="votes">
        <span>{votes}</span>
        {' '}
        {votes === 1 ? 'vote' : 'votes'}
      </p>
      <p className="created-by">
        created by
        <span>
          {` ${createdBy}`}
        </span>
      </p>
      <p className="created-at">
        updated on
        {` ${updatedAt}`}
      </p>
    </div>
  </div>
);

PollListElem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  createdBy: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
};

export default PollListElem;
