/* global d3 */

// todo fix bottom scale

const margin = { top: 20, right: 20, bottom: 20, left: 30 };

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
    .domain(d3.extent(data, d => d.DateObj))
    .range([0, width]).nice();

  const yScale = d3.scale.linear()
    .domain([0, data.length + 1])
    .range([0, height]);

  const xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(d3.time.seconds, 30)
    .orient('bottom');

  const yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  svg.selectAll('.dot')
      .data(data)
    .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 3.5)
      .attr('cx', d => xScale(d.DateObj))
      .attr('cy', d => yScale(d.Place))
      .style('fill', d => (d.Doping ? 'red' : 'green'));

  svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
    .append('text')
      .attr('class', 'label')
      .attr('x', width / 2)
      .attr('y', -6)
      .style('text-anchor', 'center')
      .text('Time');

  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 18)
      .attr('x', -height / 2)
      .style('text-anchor', 'end')
      .text('Rank');
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
