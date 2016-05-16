/* global d3 */

const margin = { top: 20, right: 10, bottom: 20, left: 10 };

const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select('#root')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const buildPlot = (data) => {
  const xScale = d3.time.scale()
    .domain(d3.extent(data, d => d.DateObj)).nice()
    .range([0, width]);

  const yScale = d3.scale.linear()
    .domain(d3.extent(data, d => d.Place)).nice()
    .range([0, height]);

  svg.selectAll('.dot')
      .data(data)
    .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 3.5)
      .attr('cx', d => xScale(d.DateObj))
      .attr('cy', d => yScale(d.Place))
      .style('fill', d => (d.Doping ? 'red' : 'green'));
};

const addDateObj = (element) => {
  const newElement = element;
  const date = new Date();
  date.setSeconds(element.Seconds);
  newElement.DateObj = date;
};

// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', (error, data) => {
d3.json('../temp/cyclist-data.json', (error, data) => {
  if (error) {
    console.log(error);
  }
  console.log(data);
  data.forEach(addDateObj);
  buildPlot(data);
});
