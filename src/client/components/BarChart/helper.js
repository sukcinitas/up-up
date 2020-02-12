import * as d3 from 'd3';

const drawChart = (datum) => {
// datum format: {{option: "", votes: 12}; votes: }
  d3.select('svg').remove();

  const data = datum.optionsList.sort((a, b) => b.votes - a.votes);
  const { sumVotes } = datum;
  const margin = {
    top: 10, right: 40, bottom: 30, left: 400,
  };
  const width = 960 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const color = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, d3.max(data, (d) => d.votes)]);

  const y = d3.scaleBand()
    .range([height, 0])
    .domain(data.map((d) => d.option))
    .padding(0.05);

  const x = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, (d) => (d.votes) / sumVotes) * 100]); // max percentage

  const svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const bars = svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('width', (d) => x(((d.votes / sumVotes) * 100))) // percentage
    .attr('y', (d) => y(d.option))
    .attr('height', y.bandwidth())
    .style('fill', (d) => color(d.votes));

  svg.selectAll('.text')
    .data(data)
    .enter().append('text')
    .attr('class', 'text')
    .attr('y', (d) => y(d.option) + y.bandwidth() / 2)
    .attr('alignment-baseline', 'central')
    .attr('x', (d) => x(((d.votes / sumVotes) * 100)) + 5)
    .text((d) => d.votes)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '20px')
    .attr('fill', (d) => color(d.votes));

  const line = svg.append('line')
    .style('stroke', 'white')
    .style('stroke-width', '0')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 0);

  bars.on('mouseout', function handleMouseOut() {
    d3.select(this)
      .style('opacity', '1');
    line
      .style('stroke', 'gray')
      .style('stroke-width', '0')
      .style('stroke-dasharray', ('3, 3'))
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);
  });
  bars.on('mouseover', function handleMouseOver(d) {
    d3.select(this)
      .style('opacity', '0.75');
    line
      .style('stroke', 'gray')
      .style('stroke-width', '2')
      .style('stroke-dasharray', ('3, 3'))
      .attr('x1', x(((d.votes / sumVotes) * 100)))
      .attr('y1', y(d.option))
      .attr('x2', x(((d.votes / sumVotes) * 100)))
      .attr('y2', height);
  });
  // bar.transition()
  // .duration(1000)
  // .attr('width', (d) => x(((d.votes / sumVotes) * 100)));

  // add the x Axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x)
      .tickFormat((d) => `${d}%`))
    .style('color', 'grey');

  // add the y Axis
  svg.append('g')
    .call(d3.axisLeft(y).tickSize(0))
    .style('color', 'grey')
    .style('font-size', '24px');
};
export default drawChart;
