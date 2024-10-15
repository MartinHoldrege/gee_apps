/*
  Purpose: functions and other elements for visualizations

  Author: Martin Holdrege
  
  Started: Oct 14, 2024
*/

// dependencies --------------------------------------------------------------------------

var figf = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");
// color palettes, see https://github.com/gee-community/ee-palettes
var palettes = require('users/gena/packages:palettes');

// colors ---------------------------------------------------------------------------------

// type 2 RR colors (i.e categorical RR)
var rrT2Palette = ['#D7191C', '#FDAE61', '#ABD9E9', '#2C7BB6']; 
var rrT2Names = ['L', 'ML', 'M', 'H+MH'];

// mapping visualizing elements -----------------------------------------------------------


exports.visT1 = {"min":-1, max: 1, "palette": palettes.matplotlib.viridis[7]}; // type 1
exports.visT2 = {"opacity":1,"min":1,"max":4, "palette":rrT2Palette}; // type 2
// purple white green
exports.visT3 = {"opacity":1,"min":-1,"max":1, "palette": palettes.matplotlib.colorbrewer.PRGn[7]}; // type 3

// building legends ------------------------------------------------------------------------


// categorical RR legend (i.e., type 2 colors)

// set position of panel
var legendT2 = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '5px 5px'
  }
});
 
// Create legend title
var legendTitleT2 = ui.Label({
  value: 'Category',
  style: {
    fontWeight: 'bold',
    fontSize: '11px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legendT2.add(legendTitleT2);
// Add color and and names
for (var i = 0; i < rrT2Palette.length; i++) {
  legendT2.add(figf.makeRow(rrT2Palette[i], rrT2Names[i]));
  }  
 
exports.legendT2 = legendT2;

// Continuous RR legend 




// testing -------------------------------------

ui.root.clear();

var map = ui.Map();

ui.root.add(map);
map.add(legendT2)