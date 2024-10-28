/*
  Purpose: Create a dictionary of image (layers) to be used for the
  app showing SCD layers (from Holdrege et al. 2024, Rangeland Ecology and Mgmt),
  also various other helper dictionaries

  Author: Martin Holdrege
  
  Started: October 28, 2024
*/

// parameters ---------------------------------------------------------------------


// dependencies --------------------------------------------------------------------

var SEI = require("users/MartinHoldrege/SEI:src/SEIModule.js");
// where the data layers  from the data_publication live
// these are the exact same layers as on science base
var pathPub = SEI.path + 'data_publication2/';
var path = SEI.path;

// this is where the data wrangling occurs
// contains one main function
// note--using this for layers where we don't have an asset
// of the layer alread, (this creates some layers on the fly,
// so will render more slowly)
var lyrsF = require("users/MartinHoldrege/SEI:scripts/05_lyrs_for_apps.js").main;

var resolution = 90;
var v = 'vsw4-3-4';
// helper dictionaries -----------------------------------------------------------
// for various 'lookup' tasks

// names of the different types of runs
var runD = {
  'Default': 'fire1_eind1_c4grass1_co20_2311',
  'CO2Fert': 'fire1_eind1_c4grass1_co21_2311',
  'NoC4Exp': 'fire1_eind1_c4grass0_co20_2311',
  'NoFire' : 'fire0_eind1_c4grass1_co20'
};

var scenarioD = {
  'RCP4.5 (2031-2060)': 'RCP45_2030-2060',
  'RCP4.5 (2071-2100)': 'RCP45_2070-2100',
  'RCP8.5 (2031-2060)': 'RCP85_2030-2060',
  'RCP8.5 (2071-2100)': 'RCP85_2070-2100'
};

var varsD = {
  'Change in SEI Class': 'c9',
  'Change in SEI': 'SEI',
  'Change in Q1 (Sagebrush; %)': 'Q1',
  'Change in Q2 (Perennials; %)': 'Q2',
  'Change in Q1 (Annuals; %)': 'Q3',
  'Drivers of SEI Change (R = sage, G = perennials, B = annuals)': 'rgb',
  'Agreement among GCMs': 'numGcmGood'
};

var dict = {}; // master dictionary

// add numGCM good to dictionary -----------------------------------------------------
// one image per scenario 
var pathProducts = path + SEI.removePatch(v) + '/products/';
Object.keys(runD).forEach(function(nameRun) { // iterating over the images for the different runs
  var image = ee.Image(pathProducts + v + '_numGcmGood_' + resolution + '_' + runD[nameRun]);
  Object.keys(scenarioD).forEach(function(nameScen) { // iteration over the bands in each image (climate scenarios)
    var newKey = 'numGcmGood_' + nameRun + '_' + scenarioD[nameScen];
    dict[newKey] = image.select('numGcmGood_' + scenarioD[nameScen]);
  });
});

// add RGB layer to dictionary ----------------------------------------------------------

// contributions by each Q compontent to changes --------------------------------------

// STOP--continue here
var qBands = ['Q1raw', 'Q2raw', 'Q3raw'];

// creating RGB maps
// R = sage, G = perennials, B = annuals

var rgbViz = {
  bands: qBands,
  min: 0,
  max: 1
};

var rgbLab = ' (R = Q1 [sage], G = Q2 [perennials], B = Q3 [annuals])';

var diffRedImg2 = ee.Image(d.get('diffRed2Img'));
var forRgb = ee.Image(d.get('qPropMed2'))
  // areas with < 0.01 delta sei are shown as grey
  .where(diffRedImg2.select('Q5s_median').abs().lt(0.01), 211/255);
map.addLayer(forRgb, rgbViz, 'RGB' + rgbLab, false);



