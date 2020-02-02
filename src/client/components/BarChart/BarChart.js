import React from "react";
import drawChart from "./helper";


class BarChart extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     data: [{option:"men", votes: 40},{option: "woman", votes: 130}]
        //     // data: []
        // }
        this.draw = this.draw.bind(this); 
    }
    draw(data) {
        drawChart(data); 
    }
    // componentDidMount() {
    //     this.draw();
    // }
    render() {
        console.log(this.props)
        {this.draw(this.props.data)}
        return (
        <div id="chart">

        </div>
        )
    }   
}


export default BarChart;