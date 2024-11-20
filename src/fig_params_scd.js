/*
  Purpose: functions and other elements for visualizations of future SCD app

  Author: Martin Holdrege
  
  Started: Oct 30, 2024
*/

// dependencies --------------------------------------------------------------------------

var figF = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");

// color palettes, see https://github.com/gee-community/ee-palettes
// var palettes = require('users/gena/packages:palettes');

// colors and visualiztion parameters----------------------------------------------------------
var grey = '#bebebe';

// number of GCMs agreeing
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

var labelsNumGcm = ["Stable CSA (robust agreement)", 
                    "Stable CSA (non-robust agreement)", 
                    "Loss of CSA (non-robust agreement)", 
                    "Loss of CSA (robust agreement)", 
                    "Stable (or improved) GOA (robust agreement)", 
                    "Stable (or improved) GOA (non-robust agreement)", 
                    "Loss of GOA (non-robust agreement)", 
                    "Loss of GOA (robust agreement)", 
                    "Other rangeland area"];
// styled layer descriptor for delta SEI

// cols delta SEI
var colsDelta = ['#67001F', '#B2182B', '#D6604D', '#F4A582', '#FDDBC7', 
  grey, '#D1E5F0', '#92C5DE', '#4393C3', '#2166AC', '#053061'];
var breaksDeltaSEI = [-1, -0.2, -0.1, -0.05, -0.02, -0.01, 0.01, 0.02, 0.05, 0.1, 0.2, 1];

var sldDiff1 = figF.createSldColorBlocks(breaksDeltaSEI, colsDelta);
exports.sldDiff1 = sldDiff1;

// cols for % change in Q
var breaksDeltaQ =[-100, -50, -25, -15, -10, -5, 5, 10, 15, 25, 50, 100];
var sldDeltaQ = figF.createSldColorBlocks(breaksDeltaQ, colsDelta);
exports.sldDeltaQ = sldDeltaQ;
// cols for c9 

var c9Palette =  ['#142b65', // stable core (black)
              '#b30000', //'#d7301f', # core becomes grow # reds from 9-class OrRd
             '#67001f',  // core becomes impacted
             '#757170', // grow becomes core
             '#99d4e7', // stable grow
             '#fc8d59',// grow becomes impacted
             '#000000', // impacted becomes core
             '#D9D9D9', // impacted becomes grow
             '#eee1ba'] // stable impacted
             
var c9Names =  [
  'Stable CSA',
  'CSA becomes GOA',
  'CSA becomes ORA',
  'GOA becomes CSA',
  'Stable GOA',
  'GOA becomes ORA',
  'ORA becomes CSA',
  'ORA becomes GOA',
  'Stable ORA'
];

exports.visC9 = {min: 1, max: 9, palette: c9Palette};


var visSEI = {min:0, max: 1, palette: ['#ece7f2', '#023858']}; // light to dark blue
exports.visSEI = visSEI;

var c3Palette = ["#142b65", "#99d4e7", "#eee1ba"];
var c3Names = ['Core Sagebrush Area (CSA)', 'Growth Opportunity Area (GOA)', 'Other Rangeland Area (ORA)'];
exports.visc3 = {opacity: 1, min:1, max:3, palette: c3Palette};

// colors for Drivers of Change
var colsDrivers = ['#FF0000', '#00FF00', '#0000FF'];
var namesDrivers = ['Sagebrush', 'Perennials', 'Annuals'];


// legends ---------------------------------------------------------------------

// styles for legend elements
var styleLegendTitle = {
    fontWeight: 'bold',
    fontSize: '11px',
    margin: '10px 0px 4px 0px',
    padding: '0'
    };


// set position of panel
var legends = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '4px'
  }
});

// SEI class legend
legends.add(
  ui.Label({
    value: 'SEI Class',
    style: styleLegendTitle
  })
);

for (var i = 0; i < c3Names.length; i++) {
  legends.add(figF.makeRow(c3Palette[i], c3Names[i]));
}  

// SEI class transition (c9)
legends.add(
  ui.Label({
    value: 'Change in SEI class',
    style: styleLegendTitle
  })
);

for (var i = 0; i < c9Names.length; i++) {
  legends.add(figF.makeRow(c9Palette[i], c9Names[i]));
}  

// Agreement among GCMs'
legends.add(
  ui.Label({
    value: 'Agreement among GCMs',
    style: styleLegendTitle
  })
);

for (var i = 0; i < colsNumGcm.length; i++) {
  legends.add(figF.makeRow(colsNumGcm[i], labelsNumGcm[i]));
}  

// Drivers of Change
legends.add(
  ui.Label({
    value: 'Primary driver of SEI change',
    style: styleLegendTitle
  })
);

for (var i = 0; i < colsDrivers.length; i++) {
  legends.add(figF.makeRow(colsDrivers[i], namesDrivers[i]));
}  

// continuos SEI

var legends = figF.makeVisParamsRampLegend(legends, visSEI, 'SEI or Q');

// Change in SEI
var legends = figF.makeSldRampLegend(legends, sldDiff1, -0.3, 0.3, 'Change in SEI');

// % Change in Q
var legends = figF.makeSldRampLegend(legends, sldDeltaQ, -70, 70, '% Change in Q');

exports.legends = legends;

// testing -------------------------------------
// Map.add(legends)