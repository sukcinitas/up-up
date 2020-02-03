import * as d3 from "d3";

const drawChart = (datum) => {
  //datum format: {{option: "", votes: 12}; votes: }
    d3.select("svg").remove();

    const data = datum.optionsList.sort((a,b) => b.votes - a.votes);
    const {sumVotes} = datum;
    const margin = {top: 10, right: 20, bottom: 30, left: 400};
    const width = 960 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    var color = d3.scaleSequential(d3.interpolateViridis)
                    .domain([0, d3.max(data, d  => d.votes)]);

    var y = d3.scaleBand()
              .range([height, 0])
              .domain(data.map(d => d.option))
              .padding(0.05);
    
    var x = d3.scaleLinear()
              .range([0, width])
              // .domain([0, d3.max(data, d => d.votes)]);
              .domain([0, d3.max(data, d => d.votes) / sumVotes * 100]); //100 procentu?????
              
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          // .attr("width", d => x(d.votes) )
          .attr("width", d => x((d.votes / sumVotes * 100))) //percentage
          .attr("y", d => y(d.option))
          .attr("height", y.bandwidth())
          .style("fill", d => color(d.votes));
    
      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x)
          .tickFormat(d => d + "%"));
    
      // add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y)
          .tickSize(0));
}
export default drawChart;