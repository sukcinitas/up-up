import React from 'react';
import PropTypes from 'prop-types';
import drawChart from './helper';

// class BarChart extends React.Component {
//   constructor(props) {
//     super(props);

//     this.draw = this.draw.bind(this);
//   }

//   draw(data) {
//     drawChart(data);
//   }

//   render() {
//     const { data } = this.props;
//     { this.draw(data) }
//     return (
//       <div id="chart" />
//     );
//   }
// }

const BarChart = ({ data }) => {
  drawChart(data);
  return <div id="chart" />;
};

BarChart.propTypes = {
  data: PropTypes.shape({
    optionsList: PropTypes.array,
    sumVotes: PropTypes.number,
  }).isRequired,
};

export default BarChart;
