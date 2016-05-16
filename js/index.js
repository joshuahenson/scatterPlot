/* global d3 */

// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', (error, data) => {
d3.json('../temp/cyclist-data.json', (error, data) => {
  if (error) {
    console.log(error);
  }
  console.log(data);
});
