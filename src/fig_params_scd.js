/*
  Purpose: functions and other elements for visualizations of future SCD app

  Author: Martin Holdrege
  
  Started: Oct 30, 2024
*/

// dependencies --------------------------------------------------------------------------

var figf = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");

// color palettes, see https://github.com/gee-community/ee-palettes
var palettes = require('users/gena/packages:palettes');

// colors  ----------------------------------------------------------------------------

var colsNumGcm = ['#053061',
                '#92c5de',
                 '#e31a1c',
                 '#800026',
                 '#252525',
                 '#bdbdbd',
                 '#ffeda0',
                 '#fd8d3c',
                 '#eee1ba'];

exports.visNumGcm = {min: 1, max: 9, palette: colsNumGcm};

//legends
var labelsNumGcm = ["Stable CSA (robust agreement)", 
                    "Stable CSA (non-robust agreement)", 
                    "Loss of CSA (non-robust agreement)", 
                    "Loss of CSA (robust agreement)", 
                    "Stable (or improved) GOA (robust agreement)", 
                    "Stable (or improved) GOA (non-robust agreement)", 
                    "Loss of GOA (non-robust agreement)", 
                    "Loss of GOA (robust agreement)", 
                    "Other rangeland area"];

// // set position of panel
// var legend = ui.Panel({
//   style: {
//     position: 'bottom-left',
//     padding: '8px 15px'
//   }
// });
 
// // Create legend title
// var legendTitle = ui.Label({
//   value: 'Agreement among GCMs',
//   style: {
//     fontWeight: 'bold',
//     fontSize: '12px',
//     margin: '0 0 4px 0',
//     padding: '0'
//     }
// });

// mapping visualizing elements -----------------------------------------------------------



// testing -------------------------------------
/*//print(legends)
var map = ui.Map();
ui.root.clear(); // for testing
ui.root.add(map);
map.add(legends)*/