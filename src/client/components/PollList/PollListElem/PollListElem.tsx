import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PollListElem.scss';

interface IPollListElemProps {
  id:string,
  name:string,
  votes:number,
  createdBy:string, 
  updatedAt:string,
};

const PollListElem:React.FunctionComponent<IPollListElemProps> = ({
  id, name, votes, createdBy, updatedAt,
}) => (
  <div className="poll-list-elem">
    <Link to={`/polls/${id}`} className="poll-list-elem__heading">
      <h2>{name}</h2>
    </Link>
    <div className="poll-list-elem__details">
      <p className="poll-list-elem__created-by">
        created by
        <span>
          {` ${createdBy}`}
        </span>
      </p>
      <span className="transparent"></span>
      <p className="poll-list-elem__votes">
        <span>{votes}</span>{votes === 1 ? ' vote' : ' votes'}
      </p>
      <span className="transparent"></span>
      <p className="poll-list-elem__updated-at">
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
