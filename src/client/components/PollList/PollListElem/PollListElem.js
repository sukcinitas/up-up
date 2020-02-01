import React from "react";
import {Link} from "react-router-dom";
import "./PollListElem.css";

const PollListElem = ({_id, name, votes, created_by, updatedAt}) => {
    return (
        <div className="poll-list__elem">
            <Link to={`/polls/${_id}`}>
                <h2>{name}</h2>
            </Link>
            <div className="details">
                <p className="votes"><span>{votes}</span> {votes === 1 ? "vote" : "votes"}</p>
                <p className="created-by">created by <span>{created_by}</span></p>
                <p className="created-at">updated on {updatedAt}</p>
            </div>
        </div>
    )
}

export default PollListElem;