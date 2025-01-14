/********************************************************
 * Purpose:
 * App to help explore and understand overlays of SEI and RR
 * 
 * Script Started: January 14, 2024
 * 
 * Author: Martin Holdrege
 * 
 * 
 * *******************************************************
*/ 


// User-defined variables -----------------------------------------------------
 
var indexBackground = 0;
var indexMain = 1; // main map layer
var indexStates = 2; // change to 3 when transparency added

// dependencies -----------------------------------------------------------

// Load module with functions 
// The functions, lists, etc are used by calling SEI.nameOfObjectOrFunction
var figF= require("users/MartinHoldrege/gee_apps:src/fig_functions.js");
var figP = require("users/MartinHoldrege/gee_apps:src/fig_params_scdrr.js");
// var f = require("users/MartinHoldrege/gee_apps:src/general_functions.js");
var load = require("users/MartinHoldrege/gee_apps:scripts/01_scdrr_load-layers.js");
//var descript = require("users/MartinHoldrege/gee_apps:scripts/01_scdrr_description.js");

// setup dictionaries ---------------------------------------------------


var varTypeD = load.varTypeD; // suitability variable
var scenD = load.scenD; // climate scenario
var maskD = load.maskD; // species

var selectD = {
    varLeft: Object.keys(varTypeD)[0], // variable
    varRight: Object.keys(varTypeD)[0],
    scenLeft: Object.keys(scenD)[0], // RCP, time-period
    scenRight: Object.keys(scenD)[2], 
    maskLeft: Object.keys(maskD)[0], // modelling assumption
    maskRight: Object.keys(maskD)[0],
    showBackground:false
};

print(selectD)

// styles -----------------------------------------------------------------

var styleDrop = {fontSize: '11px', margin: '1px', width: '160px', whiteSpace: 'normal'};
var styleDropTitle = {fontSize: '12px', padding: '3px 1px 1px 1px', margin: '1px'};
var styleTitle =  {fontSize: '14px', padding: '0px', fontWeight: 'bold', margin: '1px'};

// functions --------------------------------------------------------------

// add statesoutline
// purpose--the states outline gets removed when lower map levels are removed
// and re-added, so this adds the layer again

var addStatesBack = function(mapToChange) {
  figF.addLayerBack(mapToChange, figF.createStatesLayer(), indexStates, selectD.showBackground);
};



// functions for future layers

// loads the map for the left panel, based on the contents of the
// selectD dictionary
var updateLeftMap = function(mapToChange) {
  var lyr = load.loadLayer(selectD.varLeft, selectD.scenLeft, selectD.maskLeft);
  mapToChange.layers().set(indexMain, lyr);
};

var updateRightMap = function(mapToChange) {
  var lyr = load.loadLayer(selectD.varRight, selectD.scenRight, selectD.maskRight);
  mapToChange.layers().set(indexMain, lyr);
};

// mapToChange is the ui.Map element to add to
// side is 'Left' or 'Right', updateFun is one of the update functions defined above
var addSelectors = function (mapToChange, side, updateFun, position) {

    var labelVar = ui.Label('Select Variable:', styleDropTitle);
    var labelScen = ui.Label("Select Climate Scenario:", styleDropTitle);
    var labelMask = ui.Label("Select Mask:", styleDropTitle);

    // Configure a selection dropdown to allow the user to choose
    // between images, and set the map to update when a user 
    // makes a selection.
    
        // modeling assumptions
    var selectVar = ui.Select({
      items: Object.keys(varTypeD),
      value: selectD['var' + side], // the default value
      onChange: function(x) {
        selectD['var' + side] = x;  // Update the variable selection
        // Update the map with the new selection
        updateFun(mapToChange);
      },
      style: styleDrop
    });
    
    // climate scenario
    var selectScen = ui.Select({
      items: Object.keys(scenD),
      value: selectD['scen' + side], // the default value
      onChange: function(x) {
        selectD['scen' + side] = x;  // Update the variable selection
        // Update the map with the new selection
        updateFun(mapToChange);
      },
      style: styleDrop
    });
    
        // climate scenario
    var selectMask = ui.Select({
      items: Object.keys(maskD),
      value: selectD['mask' + side], // the default value
      onChange: function(x) {
        selectD['mask' + side] = x;  // Update the variable selection
        // Update the map with the new selection
        updateFun(mapToChange);
      },
      style: styleDrop
    });
    
    var controlPanel =
        ui.Panel({
            widgets: [labelVar, selectVar, labelScen, selectScen, labelMask, selectMask],
            style: {
                position: position,
                padding: '2px',
                margin: '2px'
            }
        });
    mapToChange.add(controlPanel);
};



// setup the two maps ----------------------------------------------------

// Create the left map, and have it display the first layer.
var leftMap = ui.Map();
leftMap.setControlVisibility(true);
leftMap.centerObject(ee.Image(maskD[0]), 6); // update as needed

// Create the right map, and have it display the last layer.
var rightMap = ui.Map();
rightMap.setControlVisibility(true);


// add selectors to the maps
addSelectors(leftMap, 'Left', updateLeftMap, 'top-left');
addSelectors(rightMap, 'Right', updateRightMap, 'top-right');


// create the split panel -----------------------------------------------


// Create a SplitPanel to hold the adjacent, linked maps.
var splitPanel = ui.SplitPanel({
    firstPanel: ui.Panel({
      widgets: [leftMap],
      style: {width: '37%', height: '100%'}  // changing the width percent so slider is more centered
    }),
    secondPanel: rightMap,
    wipe: true,
    style: {
        stretch: 'both'
    }
});

// Set the SplitPanel as the only thing in the UI root.
ui.root.widgets().reset([splitPanel]);
var linker = ui.Map.Linker([leftMap, rightMap]);
leftMap.centerObject(ee.Image(load.c3Hist), 6); // centering on one of the images

// add the layers and the selectors
// this makes the maps appear when the page loads

// first layer
leftMap.layers().set(indexBackground, figF.createBackgroundLayer('white')); 
rightMap.layers().set(indexBackground, figF.createBackgroundLayer('white')); 

// second layer
updateLeftMap(leftMap);
updateRightMap(rightMap);


// ui.root.insert(0,descript.panel);

// background/states outline functionality ----------------------------


// 4th layer: Add the states outline layer 
leftMap.layers().set(indexStates, figF.createStatesLayer()); //  on top of ther layers
rightMap.layers().set(indexStates, figF.createStatesLayer()); //  on top of ther layers

// create checboxes --------------------------------------------------

var backgroundCheckbox = figF.createBackgroundCheckbox2Maps({
  mapToChange1: leftMap,
  mapToChange2: rightMap,
  index1: indexBackground,
  index2: indexStates,
  dict: selectD
});

// add legends --------------------------------------------------------
// and checkboxes

var legendsPanel = ui.Panel({widgets: [backgroundCheckbox]});
// put checkbox for backgroun here when that's created


var legendsTitle = ui.Panel({widgets: [
  ui.Label('Legends:', {fontSize: '14px', 
    fontWeight: 'bold', padding: '0px', margin: '10px 4px 0px 4px'})]});
legendsPanel.add(legendsTitle);
legendsPanel.add(figP.legends);
ui.root.insert(0,legendsPanel);








