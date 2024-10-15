/*
  Purpose: functions and other elements for visualizations

  Author: Martin Holdrege
  
  Started: Oct 14, 2024
*/

// dependencies --------------------------------------------------------------------------

var figf = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");

// colors ---------------------------------------------------------------------------------

// type 2 RR colors (i.e categorical RR)
var rrT2Palette = ['#D7191C', '#FDAE61', '#ABD9E9', '#2C7BB6']; 
var rrT2Names = ['L', 'ML', 'M', 'H+MH'];

// mapping visualizing elements -----------------------------------------------------------

exports.visT2 = {"opacity":1,"min":1,"max":4, "palette":rrT2Palette};

// building legends ------------------------------------------------------------------------


// categorical RR legend (i.e., type 2 colors)

// set position of panel
var legendT2 = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 12px'
  }
});
 
// Create legend title
var legendTitleT2 = ui.Label({
  value: 'Categorical',
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

// testing -------------------------------------

var map = ui.Map();
map.add(legendT2)