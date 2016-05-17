/* global d3 */

const margin = { top: 30, right: 20, bottom: 20, left: 30 };

const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

d3.select('h1')
  .classed('loading', false)
  .html('Doping in Professional Bicycle Racing');

const svg = d3.select('#root')
  .append('svg')
    .attr('class', 'plot')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const formatTime = d3.time.format('%M:%S');
const convertTime = (d) => formatTime(new Date(0, 0, 0, 0, 0, d));

// Primary function to build scatterplot
const buildPlot = (data) => {
  svg.append('text')
    .attr('class', 'plot-title')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .text("35 Fastest times up Alpe d'Huez");

  const xScale = d3.scale.linear()
    .domain(d3.extent(data, (d) => d.Seconds)).nice()
    .range([0, width]).nice();

  const yScale = d3.scale.linear()
    .domain([0, data.length + 1])
    .range([0, height]);

  const xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(convertTime)
    .ticks(5);

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .ticks(4);

  svg.selectAll('.dot')
      .data(data)
    .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .attr('cx', d => xScale(d.Seconds))
      .attr('cy', d => yScale(d.Place))
      .style('fill', d => (d.Doping ? '#FF3D7F' : '#3FB8AF'));

  svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
    .append('text')
      .attr('class', 'label')
      .attr('x', width / 2)
      .attr('y', -6)
      .text('(Min:Sec)');

  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .attr('x', -height / 2)
      .text('Rank');
};

// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', (error, data) => {
d3.json('../temp/cyclist-data.json', (error, data) => {
  if (error) {
    console.log(error);
  }
  // console.log(data);
  buildPlot(data);
});

// Mike Bostock's example code has been very helpful in learning
// general scatterplot example
// http://bl.ocks.org/mbostock/3887118
//
// time scale duration
// https://bl.ocks.org/mbostock/3048166
