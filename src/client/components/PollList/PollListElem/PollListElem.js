import React from "react";
import {Link} from "react-router-dom";

const PollListElem = (props) => {
    return (
        <div>
            <Link to={`/poll/${props._id}`}>
                <h2>{props.name}</h2>
            </Link>
            <p>votes: {props.votes}</p>
            <p>created by: {props.created_by}</p>
            <p>{props.createdAt}</p>
        </div>
    )
}

export default PollListElem;