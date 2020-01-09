import React from "react";

const PollListElem = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
            <small>{props.votes}</small>
        </div>
    )
}

export default PollListElem;