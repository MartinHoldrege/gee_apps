/*
  Visualization parameters to use for visualizing SCD/RR overlay (scd rr app)
  
  To be loaded in other scripts


  Author: Martin Holdrege
  
  Started: January 13, 2025
*/


// dependencies --------------------------------------------------------------------------

var figF = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");

// colors ----------------------------------------------------------------------

// this is essentially the color scheme used by Chambers et al. https://doi.org/10.1111/csp2.13021

// var colsC3Rr1 = ['#559910',  '#A2CC7A', '#CFE6B8', '#3D0E98', '#967BCC', '#C8B8E5', '#93041A','#CC7A88', '#E6B9C0'];
var colsC3Rr1 = ["#174f28", "#167984", "#169dd0", "#845e29", "#819185", "#7ebbd2", "#dd6a29", "#d8a386", "#d3d3d3"];

// combination of SEI class and RR class ()
var labelsC3Rr1 = ['CSA, H+M', 'CSA, ML', 'CSA, L', 'GOA, H+M', 'GOA, ML', 'GOA, L', 'ORA, H+M', 'ORA, ML', 'ORA, L'];

exports.visC3Rr1 = {min: 1, max: 9, palette: colsC3Rr1};

// legends -----------------------------------------------------------------------------

// set position of panel
var legends = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '4px'
  }
});

// 9 class scd Rr overlay

var legends = figF.makeRowLegend(
  legends, 
  colsC3Rr1, 
  labelsC3Rr1, 
  'SCD, RR class'
  );

// exports --------------------------------------------------------------------------------------

exports.legends = legends; 

// testing -------------------------------------------------------------------------------

if(true) {
  Map.add(legends);
}


