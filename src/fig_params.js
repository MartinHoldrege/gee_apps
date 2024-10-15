/*
  Purpose: functions and other elements for visualizations

  Author: Martin Holdrege
  
  Started: Oct 14, 2024
*/

// dependencies --------------------------------------------------------------------------
ui.root.clear(); // for testing
var figf = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");
// color palettes, see https://github.com/gee-community/ee-palettes
var palettes = require('users/gena/packages:palettes');

// colors ---------------------------------------------------------------------------------

// type 1, continuous RR
var T1Palette = palettes.matplotlib.viridis[7]; 

// type 2 RR colors (i.e categorical RR)
var rrT2Palette = ['#D7191C', '#FDAE61', '#ABD9E9', '#2C7BB6']; 
var rrT2Names = ['L', 'ML', 'M', 'H+MH'];

// type 3, delta rr
var T3Palette = palettes.colorbrewer.PRGn[7]; // 

// mapping visualizing elements -----------------------------------------------------------

var visT1 = {"min":-1, max: 1, "palette": T1Palette}; // type 1
exports.visT1 = visT1;

exports.visT2 = {"opacity":1,"min":1,"max":4, "palette":rrT2Palette}; // type 2
// purple white green
 
var visT3 = {"opacity":1,"min":-1,"max":1, "palette": T3Palette}; // type 3
exports.visT3 = visT3;

// building legends ------------------------------------------------------------------------

var styleLegendTitle = {
    fontWeight: 'bold',
    fontSize: '11px',
    margin: '0 0 4px 0',
    padding: '0'
    };
 
// no wrapping in 'ui.label' so can't reuse and not get 'component already rendered' error   
var emptyLine = {
    value: '            ',
    style: {fontSize: '6px'},
  };

var panel = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '6px 6px'
  }
});
// continous RR legend
var panel = figf.makeVisParamsRampLegend(panel, visT1, 'Continuous R&R');
// panel.add(emptyLine)

// exports.legendT1 = legendT1;


// categorical RR legend (i.e., type 2 colors)


// Create legend title
var legendTitleT2 = ui.Label({
  value: 'Categorical R&R',
  style: styleLegendTitle
});
 
// Add the title to the panel
panel.add(ui.Label(emptyLine)).add(legendTitleT2);
// Add color and and names
for (var i = 0; i < rrT2Palette.length; i++) {
  panel.add(figf.makeRow(rrT2Palette[i], rrT2Names[i]));
  }  
 
//exports.legendT2 = legendT2;

// delta R&R
panel.add(ui.Label(emptyLine));
var panel = figf.makeVisParamsRampLegend(panel, visT3, 'Delta R&R');
// exports.legendT3 = legendT3;



// testing -------------------------------------



var map = ui.Map();

ui.root.add(map);
map.add(panel)