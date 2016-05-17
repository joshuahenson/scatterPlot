/* global d3 */

const margin = { top: 30, right: 20, bottom: 20, left: 30 };

const tooltip = d3.select('#root').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const legendKey = [
  { class: 'dot doping', alleged: 'Riders with doping allegations' },
  { class: 'dot not-doping', alleged: 'Riders without doping allegations' }
];

const svg = d3.select('#root')
  .append('svg')
    .attr('class', 'plot')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const formatTime = d3.time.format('%M:%S');
const convertTime = (d) => formatTime(new Date(0, 0, 0, 0, 0, d));

const formatTooltip = (d) => `${d.Name}: ${d.Nationality}<br/>Rank: ${d.Place}<br/>
  Time: ${d.Time} in ${d.Year}<br/>${d.Doping ? `<br/>${d.Doping}` : ''}`;

// Primary function to build scatterplot
const buildPlot = (data) => {
  svg.append('text')
    .attr('class', 'plot-title')
    .attr('x', width / 2)
    .attr('y', -margin.top / 2)
    .text('35 Fastest times up Alpe d\'Huez');

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

  svg.selectAll('.circle')
      .data(data)
    .enter().append('circle')
      .style('fill', '#DAD8A7')
      .attr('r', 4)
      .attr('cx', 5)
      .attr('cy', 0)
      .on('mouseover', d => {
        tooltip.transition()
          .duration(250)
          .style('opacity', 1);
        tooltip.html(formatTooltip(d))
          .style('left', `${d3.event.pageX + 20}px`)
          .style('top', `${d3.event.pageY - 30}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(250)
          .style('opacity', 0);
      })
      .transition()
        .duration(2000)
        .delay(500)
        .style('fill', d => (d.Doping ? '#FF3D7F' : '#3FB8AF'))
        .attr('cx', d => xScale(d.Seconds))
        .attr('cy', d => yScale(d.Place));

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

  const legend = svg.selectAll('.legend')
    .data(legendKey)
    .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

  legend.append('rect')
    .attr('x', margin.left)
    .attr('y', height - 80)
    .attr('width', 14)
    .attr('height', 14)
    .attr('class', d => d.class)
    .style('opacity', 0)
    .transition()
      .duration(500)
      .delay(2000)
      .style('opacity', 1);

  legend.append('text')
    .attr('x', margin.left + 16)
    .attr('y', height - 80)
    .attr('dy', '14px')
    .style('text-anchor', 'start')
    .text(d => d.alleged)
    .style('opacity', 0)
    .transition()
      .duration(500)
      .delay(2000)
      .style('opacity', 1);
};

// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', (error, data) => {
d3.json('../temp/cyclist-data.json', (error, data) => {
  // if (error) {
  //   console.log(error);
  // }
  // console.log(data);
  buildPlot(data);
});

// Mike Bostock's example code has been very helpful in learning
// general scatterplot example
// http://bl.ocks.org/mbostock/3887118
//
// time scale duration
// https://bl.ocks.org/mbostock/3048166
