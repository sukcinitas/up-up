import * as d3 from 'd3';
// import * as d3 from 'd3/dist/d3.min';


// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
const hexToRgbA = (hex: string, opacity: number): string => {
  const arr = hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`,
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
  return `rgba(${arr.join(',')}, ${opacity})`;
};

const drawChart = (
  datum: {
    optionsList: { option: string; votes: number }[];
    sumVotes: number;
  },
  w: number = 860,
): void => {
  d3.select('svg').remove();

  // function addDots(option: string): string {
  //   if (
  //     window.innerWidth < 400 ||
  //     document.documentElement.clientWidth < 400 ||
  //     document.body.clientWidth < 400
  //   ) {
  //     if (option.length > 5) {
  //       return `...${option.substr(-5)}`;
  //     }
  //   }
  //   if (option.length < 12) {
  //     return option;
  //   }
  //   return `...${option.substr(-12)}`;
  // }

  const dataPrev: { option: string; votes: number }[] =
    datum.optionsList;
  const data = dataPrev.map(
    (item: {
      option: string;
      votes: number;
    }): {
      option: string;
      votes: number;
      optionM: string;
    } => ({
      option: item.option,
      votes: item.votes,
      optionM: item.option,
    }),
  );
  const { sumVotes } = datum;
  const margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } = {
    top: 10,
    right: 40,
    bottom: 30,
    left: 100,
  };

  const widthPrimal = w < 640 ? 0.9 * w : 0.7 * w;
  const heightPrimal = w < 640 ? 500 : 400;
  const width: number = widthPrimal - margin.left - margin.right;
  const height: number = heightPrimal - margin.top - margin.bottom;

  const color = d3
    .scaleSequential(d3.interpolateViridis)
    .domain([
      0,
      d3.max(
        dataPrev,
        (d: { option: string; votes: number }): number => d.votes,
      ),
    ]);

  const y = d3
    .scaleBand()
    .range([height, 0])
    .domain(
      data.map(
        (d: {
          option: string;
          votes: number;
          optionM: string;
        }): string => d.option,
      ),
    )
    .padding(0.2);

  const x = d3
    .scaleLinear()
    .range([0, width])
    .domain([
      0,
      d3.max(
        dataPrev,
        (d: { option: string; votes: number }): number =>
          d.votes / sumVotes,
      ) * 100,
    ]);

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const line = svg
    .append('line')
    .style('stroke', 'white')
    .style('stroke-width', '0')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 0);

  const tooltip = d3
    .select('#chart')
    .style('position', 'relative')
    .append('div')
    .attr('id', 'tooltip');

  const handleOut = (): void => {
    tooltip.style('display', 'none');
    line
      .style('stroke', 'black')
      .style('stroke-width', '0')
      .style('stroke-dasharray', '3, 3')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0);
  };
  const handleOver = (_event: Event, d: {
    option: string;
    votes: number;
    optionM: string;
  }): void => {
    tooltip
      .style('display', 'inline-block')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border', `2px solid ${color(d.votes)}`)
      .style('right', `${0}px`)
      .style('top', `${20}px`)
      .style('z-index', 100)
      .html(
        `${d.optionM} - <span>${Math.round(
          (d.votes / sumVotes) * 100,
        )}%</span>`,
      );

    line
      .style('stroke', 'black')
      .style('stroke-width', '2')
      .style('stroke-dasharray', '3, 3')
      .attr('x1', x((d.votes / sumVotes) * 100))
      .attr('y1', y(d.option))
      .attr('x2', x((d.votes / sumVotes) * 100))
      .attr('y2', height);
  };

  const bars = svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', 10) // percentage
    .attr(
      'y',
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): number => y(d.option),
    )
    .attr('height', y.bandwidth())
    .style(
      'fill',
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): string => hexToRgbA(color(d.votes), 0.6),
    )
    .style(
      'stroke',
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): string => color(d.votes),
    )
    .style('stroke-width', 2)
    .on('mouseover', handleOver)
    .on('touchstart', handleOver)
    .on('mouseout', handleOut)
    .on('touchend', handleOut);

  svg
    .selectAll('.text')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'text')
    .attr(
      'y',
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): number => y(d.option) + y.bandwidth() / 2 + 9,
    )
    .attr(
      'x',
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): number => x((d.votes / sumVotes) * 100) + 5,
    )
    .text(
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): number => d.votes,
    )
    .attr('font-family', 'Roboto Condensed, sans-serif')
    .attr('font-size', '14px')
    .attr(
      'fill',
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): string => color(d.votes),
    );

  bars
    .transition()
    .duration(1000)
    .attr(
      'width',
      (d: {
        option: string;
        votes: number;
        optionM: string;
      }): number => x((d.votes / sumVotes) * 100),
    );

  // add the x Axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(5)
        .tickFormat((d) => `${d}%`),
    )
    .style('color', 'black')
    .style('stroke-width', '2');

  // add the y Axis
  svg
    .append('g')
    .call(d3.axisLeft(y).tickSize(0))
    .style('color', 'black')
    .style('font-size', '12px')
    .style('stroke-width', '2')
    .style('font-family', 'Merriweather Sans, sans-serif');
};
export default drawChart;
