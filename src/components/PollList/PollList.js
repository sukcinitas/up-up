import React from "react";
import PollListElem from "./PollListElem/PollListElem";

class PollList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            polls: []
        }
    }
    // componentDidMount(){
    //     fetch("/")
    //         .then(res => res.json())
    //         .then(polls => {
    //             console.log(polls)
    //             this.setState({
    //                 polls
    //             })
    //         });
    // }
    render() {
        const list = this.state.polls.map(poll => {
            return  <div key={poll._id}>
                        <PollListElem name={poll.name} votes={poll.votes}/>
                    </div>
        })
        return (
            <div>
                {list}
            </div>
        ) 
    }
}

export default PollList;