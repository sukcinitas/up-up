import * as d3 from "d3";

const drawChart = (info) => {
  d3.select("svg").remove();
    const data = info;
    const margin = {top: 10, right: 20, bottom: 30, left: 400};
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    // set the ranges
    var y = d3.scaleBand()
              .range([height, 0])
              .domain(data.map(d => d.option))
              .padding(0.05);
    
    var x = d3.scaleLinear()
              .range([0, width])
              .domain([0, d3.max(data, d => d.votes)]);
              
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
    
      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          //.attr("x", function(d) { return x(d.sales); })
          .attr("width", function(d) {return x(d.votes); } )
          .attr("y", function(d) { return y(d.option); })
          .attr("height", y.bandwidth());
    
      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
    
      // add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y));
}
export default drawChart;