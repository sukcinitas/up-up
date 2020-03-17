import * as d3 from 'd3';

function hexToRgbA(hex, opacity){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c = hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+', ' + opacity + ')';
  }
  throw new Error('Bad Hex');
}
const drawChart = (datum:{optionsList:{option:string, votes:number}[], sumVotes:number}) => {
  d3.select('svg').remove();

  // const data = datum.optionsList.sort((a:{option:string, votes:number}, b:{option:string, votes:number}) => b.votes - a.votes);
  const data = datum.optionsList;
  const sumVotes:number = datum.sumVotes;
  const margin = {
    top: 10, right: 40, bottom: 30, left: 0,
  };
  const width = 960 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const color = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, d3.max(data, (d:{option:string, votes:any}) => d.votes)]);

  const y = d3.scaleBand()
    .range([height, 0])
    .domain(data.map((d:{option:string, votes:number}):any => d.option))
    .padding(0.2);

  const x = d3.scaleLinear()
    .range([0, width])
    .domain([0, d3.max(data, (d:{option:string, votes:number}):any => (d.votes) / sumVotes) * 100]); // max percentage

  const svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const bars = svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('width', (d:{option:string, votes:number}) => x(((d.votes / sumVotes) * 100))) // percentage
    .attr('y', (d:{option:string, votes:number}):any => y(d.option))
    .attr('height', y.bandwidth())
    .style('fill', (d:{option:string, votes:number}) => hexToRgbA(color(d.votes), 0.6))
    .style('stroke', (d) => color(d.votes));

  svg.selectAll('.text')
    .data(data)
    .enter().append('text')
    .attr('class', 'text')
    .attr('y', (d:{option:string, votes:number}) => y(d.option) + y.bandwidth() / 2)
    .attr('alignment-baseline', 'central')
    .attr('x', (d:{option:string, votes:number}) => x(((d.votes / sumVotes) * 100)) + 5)
    .text((d:{option:string, votes:number}) => d.votes)
    .attr('font-family', 'sans-serif')
    .attr('font-size', '20px')
    .attr('fill', (d:{option:string, votes:number}) => color(d.votes));

  const line = svg.append('line')
    .style('stroke', 'white')
    .style('stroke-width', '0')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 0);

  const tooltip = d3.select('#chart')
    .style('position', 'relative')
    .append('div')
    .attr('id', 'tooltip');

  bars.on('mouseout', function handleMouseOut(this:any, d:{option:string, votes:number}) {
    // d3.select(this)
      // .style('fill', hexToRgbA(color(d.votes), 0.6))
    tooltip
      .style('display', 'none')
    line
      .style('stroke', 'gray')
      .style('stroke-width', '0')
      .style('stroke-dasharray', ('3, 3'))
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);
  });
  bars.on('mouseover', function handleMouseOver(this:any, d:{option:string, votes:number}) {
    // d3.select(this)
      // .style('fill', hexToRgbA(color(d.votes), 0.6))
      tooltip
      .style('display', 'inline-block')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border', '2px solid ' + color(d.votes))
      .style('right', 0 + 'px')
      .style('top', 20 + 'px')
      .style('z-index', 100)
      .html(d.option + ' - ' + Math.round((d.votes / sumVotes) * 100) + '%');

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
  // svg.append('g')
  //   .call(d3.axisLeft(y).tickSize(0))
  //   .style('color', 'black')
  //   .style('font-size', '12px');

};
export default drawChart;
