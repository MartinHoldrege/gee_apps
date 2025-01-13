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

var colsScdRr1 = ['#559910',  '#A2CC7A', '#CFE6B8', '#3D0E98', '#967BCC', '#C8B8E5', '#93041A','#CC7A88', '#E6B9C0'];

// combination of SEI class and RR class ()
var labelsScdRr1 = ['CSA, H+M', 'CSA, ML', 'CSA, L', 'GOA, H+M', 'GOA, ML', 'GOA, L', 'ORA, H+M', 'ORA, ML', 'ORA, L'];


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
  colsScdRr1, 
  labelsScdRr1, 
  'SCD, RR class'
  );

// exports --------------------------------------------------------------------------------------

exports.legends = legends; 

// testing -------------------------------------------------------------------------------

if(false) {
  Map.add(legends);
}


