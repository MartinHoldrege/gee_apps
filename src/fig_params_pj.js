/*
  Purpose: functions and other elements for visualizations of PJ niche app

  Author: Martin Holdrege
  
  Started: Jan 8, 2025
*/

// dependencies --------------------------------------------------------------------------

var figF = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");
// Get a palette: a list of hex strings
var palettes = require('users/gena/packages:palettes');

// colors and visualization parameters----------------------------------------------------------

// Current suitability
var viridis = palettes.matplotlib.viridis[7];

var visCurSuit = {min: 0, max: 1, palette: viridis};
exports.visCurSuit = visCurSuit;

// delta suitability
// var warmcool = palettes.misc.warmcool[7];
// warmcool[3] = '#FFFFFF'; // replacing the middle color with white
var warmcool = ['#8B1A1A', '#FFFFFF', '#191970'];
var visDeltaSuit = {min: -1, max: 1, palette: warmcool};

exports.visDeltaSuit = visDeltaSuit;

// robust change
var colsDeltaRobust = ['#888888', '#88CCEE', "#CC6677",'#661100', "#44AA99", 
  "#332288", "#117733", '#6699CC', '#DDCC77'];

var labelsDeltaRobust = [
  "Below threshold", // 0
  "Above threshold, decreasing", // 1
  "Robust decrease to threshold", // 2
  "Robust decrease to below threshold", // 3
  "Robust increase to threshold", //4
  "Above threshold, increasing", // 5
  "Robust increase to above threshold", // 6
  "Above threshold, nonrobust change", // 7
  "Nonrobust near threshold" // 8
];

// order of labels/colors to use in for the legend
var labelOrder = [5, 7, 1, 3, 2, 6, 4, 8, 0];


exports.visDeltaRobust = {min: 0, max: 8, palette: colsDeltaRobust};

// legends ---------------------------------------------------------------------------------


// styles for legend elements
var styleLegendTitle = {
    fontWeight: 'bold',
    fontSize: '11px',
    margin: '20px 0px 4px 0px',
    padding: '0'
    };


// set position of panel
var legends = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '4px'
  }
});

// suitability
// continue here
var legends = figF.makeVisParamsRampLegend2({
  existing_panel: legends, 
  visParams: visCurSuit, 
  title: 'Suitability', 
  styleLegendTitle: styleLegendTitle
});

// change in suitability

var legends = figF.makeVisParamsRampLegend2({
  existing_panel: legends, 
  visParams: visDeltaSuit, 
  title: 'Change in suitability', 
  styleLegendTitle: styleLegendTitle
});
// robust change (categorical)

// reorder legend to match fig 4 in Noel et al. 
var colsDeltaRobustReorder = labelOrder.map(function(i) {
  return colsDeltaRobust[i];
});

var labelsDeltaRobustReorder = labelOrder.map(function(i) {
  return labelsDeltaRobust[i];
});

var legends = figF.makeRowLegend(
  legends, 
  colsDeltaRobustReorder, 
  labelsDeltaRobustReorder, 
  'Change in suitability (category)', 
  styleLegendTitle
  );

exports.legends = legends; 

// testing
// Map.add(legends);



