import React from "react";

const Poll = (props) => {
    const {question, options} = props.poll;
    return (
        <div>
            <h1>{question}</h1>
            <div>
                {options.map(option => (<button>{option}</button>))}
            </div>
        </div>
    )
}

export default Poll;