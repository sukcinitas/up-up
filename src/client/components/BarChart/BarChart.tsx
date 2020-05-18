import * as React from 'react';
import * as PropTypes from 'prop-types';
import drawChart from './helper';

interface Props {
  data:{
    optionsList: {option:string, votes:number}[],
    sumVotes:number,
  },
  width: number,
  leftMargin: number,
}

const BarChart:React.FunctionComponent<Props> = ({ data, width, leftMargin }) => {
  drawChart(data, width, leftMargin);
  return <div id="chart" />;
};

BarChart.propTypes = {
  data: PropTypes.exact({
    optionsList: PropTypes.arrayOf(PropTypes.exact(
      {
        option: PropTypes.string.isRequired,
        votes: PropTypes.number.isRequired,
      },
    )).isRequired,
    sumVotes: PropTypes.number.isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
  leftMargin: PropTypes.number.isRequired,
};

export default BarChart;
