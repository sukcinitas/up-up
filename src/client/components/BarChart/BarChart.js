import React from "react";
import drawChart from "./helper";

class BarChart extends React.Component {
    constructor(props) {
        super(props);

        this.draw = this.draw.bind(this); 
    }
    draw(data) {
        drawChart(data); 
    }

    render() {
        {this.draw(this.props.data)}
        return (
        <div id="chart">

        </div>
        )
    }   
}

export default BarChart;