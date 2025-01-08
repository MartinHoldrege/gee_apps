/*
  Purpose: functions and other elements for visualizations of PJ niche app

  Author: Martin Holdrege
  
  Started: Jan 8, 2025
*/

// dependencies --------------------------------------------------------------------------

// var figF = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");
// Get a palette: a list of hex strings
var palettes = require('users/gena/packages:palettes');

// colors and visualization parameters----------------------------------------------------------

// Current suitability
var viridis = palettes.matplotlib.viridis[7];

var visCurSuit = {min: 0, max: 1, palette: viridis};
exports.visCurSuit = visCurSuit;

// delta suitability
var warmcool = palettes.misc.warmcool[7];
warmcool[3] = '#FFFFFF'; // replacing the middle color with white
var visDeltaSuit = {min: -1, max: 1, palette: warmcool};

exports.visDeltaSuit = visDeltaSuit;

// robust change


var colsDeltaRobust = ['#332288', '#6699CC', '#88CCEE', '#661100', '#CC6677', 
'#117733', '#44AA99', '#DDCC77', '#888888'];


var labelsDeltaRobust = ['Increase always above threshold', 'Nonrobust above threshold', 'Decrease above threshold', 
'Decrease to below threshold', 'Decrease across threshold', 'Increase to above threshold', 
'Increase across threshold', 'Nonrobust across threshold', 'Below threshold'];


 
