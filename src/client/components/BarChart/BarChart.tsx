import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import drawChart from './helper';

type TBarChartProps = {
  data: {
    optionsList: Array<{ option: string; votes: number }>;
    sumVotes: number;
  };
  width: number;
  leftMargin: number;
};

const BarChart = ({
  data,
  width,
  leftMargin,
}: TBarChartProps): JSX.Element => {
  useEffect(() => {
    if (data.sumVotes !== 0) {
      drawChart(data, width);
    }
  }, [data, width, leftMargin]);

  return <div id="chart" />;
};

BarChart.propTypes = {
  data: PropTypes.shape({
    optionsList: PropTypes.arrayOf(
      PropTypes.shape({
        option: PropTypes.string.isRequired,
        votes: PropTypes.number.isRequired,
      }).isRequired,
    ).isRequired,
    sumVotes: PropTypes.number,
  }).isRequired,
  width: PropTypes.number.isRequired,
  leftMargin: PropTypes.number.isRequired,
};

export default BarChart;
