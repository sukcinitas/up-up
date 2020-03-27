import * as React from 'react';
import * as PropTypes from 'prop-types';
import drawChart from './helper';
import barChartWidth from '../../util/barChartWidth';

interface Props {
  data:{
    optionsList: {option:string, votes:number}[],
    sumVotes:number,
  }
}

const BarChart:React.FunctionComponent<Props> = ({ data }) => {
  drawChart(data, barChartWidth().w, barChartWidth().left); // <= IE8 does not support innerWidth
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
