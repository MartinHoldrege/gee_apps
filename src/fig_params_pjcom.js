/*
  Purpose: functions and other elements for visualizations of PJ community app

  Author: Martin Holdrege
  
  Started: Sept 22, 2025
*/

// dependencies --------------------------------------------------------------------------

var figF = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");

// Get a palette: a list of hex strings
var palettes = require('users/gena/packages:palettes');

// colors and visualization parameters----------------------------------------------------------

// community suitability & mature and old growth
var viridis = palettes.matplotlib.viridis[7];
var visD = {}; // dictionary containing visualizion elements

visD.cs = {min: 0, max: 5.6, palette: viridis};
visD.hcfs = {min: 0, max: 1, palette: viridis};

var labelsCsHcfs = [
  'high CS & high HCFS',   // 1
  'high CS & low HCFS',    // 2
  'high CS & medium HCFS', // 3
  'low CS & high HCFS',    // 4
  'low CS & low HCFS',     // 5
  'low CS & medium HCFS',  // 6
  'medium CS & high HCFS', // 7
  'medium CS & low HCFS',  // 8
  'medium CS & medium HCFS'// 9
];

var colsCsHcfs = [
  '#174f28', // 1 = high CS & high HCFS
  '#169dd0', // 2 = high CS & low HCFS
  '#167984', // 3 = high CS & medium HCFS
  '#dd6a29', // 4 = low CS & high HCFS
  '#d3d3d3', // 5 = low CS & low HCFS
  '#d8a386', // 6 = low CS & medium HCFS
  '#845e29', // 7 = medium CS & high HCFS
  '#7ebbd2', // 8 = medium CS & low HCFS
  '#819185'  // 9 = medium CS & medium HCFS
];
visD.cs_hcfs_biclass = {min: 1, max: 9, palette: colsCsHcfs};

var labelsCsMog = [
  'high CS & high MOG',
  'high CS & low MOG',
  'high CS & medium MOG',
  'low CS & high MOG',
  'low CS & low MOG',
  'low CS & medium MOG',
  'medium CS & high MOG',
  'medium CS & low MOG',
  'medium CS & medium MOG'
];

var colsCsMog = [
  '#3f2949',
  '#4885c1',
  '#435786',
  '#ae3a4e',
  '#cabed0',
  '#bc7c8f',
  '#77324c',
  '#89a1c8',
  '#806a8a'
];

visD.cs_mog_biclass = {min: 1, max: 9, palette: colsCsMog};

var labelsCsBp = [
  'high CS & high BP',    // 1
  'high CS & low BP',     // 2
  'high CS & medium BP',  // 3
  'low CS & high BP',     // 4
  'low CS & low BP',      // 5
  'low CS & medium BP',   // 6
  'medium CS & high BP',  // 7
  'medium CS & low BP',   // 8
  'medium CS & medium BP' // 9
];

var colsCsBp = [
  '#4c6e01', // 1
  '#488fb0', // 2
  '#498062', // 3
  '#dea301', // 4
  '#d3d3d3', // 5
  '#d8bd75', // 6
  '#968901', // 7
  '#8fb1c2', // 8
  '#929f6c'  // 9
];

visD.cs_bp_biclass = {min: 1, max: 9, palette: colsCsBp};

var labelsClimAdap = [
  'category A', // 1
  'category B', // 2
  'category C', // 3
  'category D', // 4
  'category E', // 5
  'category F', // 6
  'category G', // 7
  'category H'  // 8
];

var colsClimAdap = [
  '#27408B', // 1
  '#87CEEB', // 2
  '#006400', // 3
  '#90EE90', // 4
  '#9400D3', // 5
  '#EEAEEE', // 6
  '#CD2626', // 7
  '#EECFA1'  // 8
];

visD.clim_adap = {min: 1, max: 8, palette: colsClimAdap};
exports.visD = visD; 

// legends ---------------------------------------------------------------------------------
 /*

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

*/
// testing
// Map.add(legends);



