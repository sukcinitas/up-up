import * as React from 'react';
import * as PropTypes from 'prop-types';
import drawChart from './helper';

interface Props {
  data:{
    optionsList: {option:string, votes:number}[],
    sumVotes:number,
  }
}

const BarChart:React.FunctionComponent<Props> = ({ data }) => {
  drawChart(data);
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
};

export default BarChart;
