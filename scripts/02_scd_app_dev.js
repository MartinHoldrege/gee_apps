/********************************************************
 * Purpose:
 * Simple app to show basic layers shown in Holdrege et al. 2024 (rangeland ecology and management)
 * Based on the SEI/scripts/06_app_sage-climate-training.js app. 
 * Goal is to have a slider in the middle, allowing for the comparison of two different
 * layers
 * 
 * Script Started: October 22, 2024
 * 
 * Author: Martin Holdrege
 * 
 * 
* 
 * *******************************************************
*/ 


// User-defined variables -----------------------------------------------------
 

// dependencies -----------------------------------------------------------

// Load module with functions 
// The functions, lists, etc are used by calling SEI.nameOfObjectOrFunction
var SEI = require("users/MartinHoldrege/SEI:src/SEIModule.js");
var figP = require("users/MartinHoldrege/SEI:src/fig_params.js");
var f = require("users/MartinHoldrege/gee_apps:src/general_functions.js");
var load = require("users/MartinHoldrege/gee_apps:scripts/01_scd_load-layers.js");


// setup dictionaries ---------------------------------------------------


// keys are names to display in the dropdown
var runDisplayD = {
  'Default': 'Default',
  'CO2 fertilization effect enabled': 'CO2Fert',
  'No C4 grass expansion': 'NoC4Exp',
  'No wildire simulated' : 'NoFire'
};

// variable names to display in the dropdown
var varDisplayD = {
  'SEI class': 'c3',
  'Change in SEI class': 'c9',
  'Change in SEI': 'SEI', 
  "% change in Q1 ('quality' score of sagebrush)": 'Q1',
  "% change in Q2 ('quality' score of perennials)": 'Q2',
  "% change in Q3 ('quality' score of annuals)": 'Q3',
  'Drivers of change in SEI': 'rgb',
  'Agreement among GCMs': 'numAgree'
};

var scenD = load.scenD; // dictionary of climate scenarios
var histNamesD = load.histNamesD

// Variables to store current selections
// using a dictionary that can be updated in child
// environments (so don't have scoping issues)
// this is where the default's are setup (for left and right panels)
var selectD = {
    varLeft: Object.keys(varDisplayD)[1], // variable
    varRight: Object.keys(varDisplayD)[1],
    scenLeft: Object.keys(scenD)[1], // RCP, time-period
    scenRight: Object.keys(scenD)[3], 
    runLeft: Object.keys(runDisplayD)[0], // modelling assumption
    runRight: Object.keys(runDisplayD)[0],
    histLayer: Object.keys(histNamesD)[0], // historical layer to show
    showBackground:false
};

// sytles -----------------------------------------------------------

var styleDrop = {fontSize: '11px', margin: '1px'}
var styleDropTitle = {fontSize: '11px', padding: '3px 1px 1px 1px', margin: '1px'}
var styleTitle =  {fontSize: '12px', padding: '0px', fontWeight: 'bold', margin: '1px'};

// functions --------------------------------------------------------------

// functions for future layers

// loads the map for the left panel, based on the contents of the
// selectD dictionary

var updateHistMap = function(mapToChange) {
  var key = histNamesD[selectD.histLayer];
  var lyr = load.histLayersD[key];
  mapToChange.layers().set(0, lyr);
};

function addHistSelector(mapToChange, position) {
    var labelTitle = ui.Label('Layers for 2017-2020', styleTitle);
    var labelHist = ui.Label('Select Variable:', styleDropTitle);

    // slecect between historical SEI layers
    var selectHist = ui.Select({
      items: Object.keys(histNamesD),
      value: selectD.histLayer, // the default value
      onChange: function(x) {
        selectD.histLayer = x;  // Update the variable selection
        // Update the map with the new selection
        updateHistMap(mapToChange);
      },
      style: styleDrop
    });
    
    var controlPanel =
        ui.Panel({
            widgets: [labelTitle, labelHist, selectHist],
            style: {
                position: position
            }
        });

    mapToChange.add(controlPanel);
}

// setup the two maps ----------------------------------------------------

// Create the left map, and have it display the first layer.
var leftMap = ui.Map();
leftMap.setControlVisibility(true);
// map.centerObject(SEI.cur.select('Q5sc3'), 6); // update as needed

// Create the right map, and have it display the last layer.
var rightMap = ui.Map();
rightMap.setControlVisibility(true);


addHistSelector(rightMap, 'bottom-right')
// create the split panel -----------------------------------------------

// Create a SplitPanel to hold the adjacent, linked maps.
var splitPanel = ui.SplitPanel({
    firstPanel: leftMap,
    secondPanel: rightMap,
    wipe: true,
    style: {
        stretch: 'both'
    }
});

// Set the SplitPanel as the only thing in the UI root.
ui.root.widgets().reset([splitPanel]);
var linker = ui.Map.Linker([leftMap, rightMap]);
leftMap.centerObject(load.histSEI, 6); // centering on one of the images



