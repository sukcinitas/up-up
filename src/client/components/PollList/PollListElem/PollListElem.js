import React from "react";
import {Link} from "react-router-dom";
import "./PollListElem.css";

const PollListElem = ({_id, name, votes, created_by, createdAt}) => {
    return (
        <div className="poll-list__elem">
            <Link to={`/polls/${_id}`}>
                <h2>{name}</h2>
            </Link>
            <div>
                <p className="votes">{votes} {votes === 1 ? "vote" : "votes"}</p>
                <p className="created-by">created by: {created_by}</p>
                <p className="created-at">{createdAt}</p>
            </div>
        </div>
    )
}

export default PollListElem;