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
var colsDeltaRobust = ['#888888', '#88CCEE', "#CC6677",'#661100', "#44AA99", 
  "#332288", "#117733", '#6699CC', '#DDCC77'];

var labelsDeltaRobust = [
  "Below threshold", 
  "Above threshold, decreasing", 
  "Robust decrease to threshold",
  "Robust decrease to below threshold",
  "Robust increase to threshold",
  "Above threshold, increasing",
  "Robust increase to above threshold",
  "Above threshold, nonrobust change",
  "Nonrobust at threshold"
];

exports.visDeltaRobust = {min: 0, max: 8, palette: colsDeltaRobust};

 
