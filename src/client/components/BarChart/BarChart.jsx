import React from 'react';
import PropTypes from 'prop-types';
import drawChart from './helper';

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
