/*
  Purpose: Create a dictionary of image (layers) to be used for the
  app showing SCD layers (from Holdrege et al. 2024, Rangeland Ecology and Mgmt),
  also various other helper dictionaries

  Author: Martin Holdrege
  
  Started: October 28, 2024
*/

// parameters ---------------------------------------------------------------------

/*
  new approach--develop functions for each layer,
  input is scenario and run and visualization parameters
  output is map layer
*/

// dependencies --------------------------------------------------------------------

var f = require('users/MartinHoldrege/gee_apps:src/general_functions.js')
var SEI = require("users/MartinHoldrege/SEI:src/SEIModule.js");
var figP = require("users/MartinHoldrege/gee_apps:src/fig_params_scd.js");

// function for returning dictionaries of layers
// used here for the rgb layers
var lyr = require("users/MartinHoldrege/SEI:scripts/05_lyrs_for_apps.js");

// where the data layers  from the data_publication live
// these are the exact same layers as on science base
var path = SEI.path;
var pathPub = path + 'data_publication2/';
var pathProducts = path + 'vsw4-3' + '/products/';

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

// scenarios
var scenD = {
  'RCP4.5 (2031-2060)': 'RCP45_2030-2060',
  'RCP4.5 (2071-2100)': 'RCP45_2070-2100',
  'RCP8.5 (2031-2060)': 'RCP85_2030-2060',
  'RCP8.5 (2071-2100)': 'RCP85_2070-2100'
};

// create another version with more correct dates
// because some assets are named that way.
var scenD2 = f.copyDict(scenD);
Object.keys(scenD2).forEach(function(key) { // iteration over the bands in each image (climate scenarios)
    scenD2[key] = scenD[key].replace('2030', '2031').replace('2070', '2071');
  });

var varsD = {
  'Change in SEI Class': 'c9',
  'Change in SEI': 'SEI',
  'Change in Q1 (Sagebrush; %)': 'Q1',
  'Change in Q2 (Perennials; %)': 'Q2',
  'Change in Q1 (Annuals; %)': 'Q3',
  'Drivers of SEI Change (R = sage, G = perennials, B = annuals)': 'rgb',
  'Agreement among GCMs': 'gcmAgree'
};

var dict = ee.Dictionary({}); // master dictionary

// add numGCM good to dictionary -----------------------------------------------------

// agreement on change in SEI class (i.e. type of map shown in fig 2 of Holdrege et al. 2024)
var loadGcmAgree =  function(nameRun, nameScen) {
  var image = ee.Image(pathProducts + v + '_numGcmGood_' + resolution + '_' + runD[nameRun] + '_mode')
    .select('numGcmGood_' + scenD[nameScen]);

  var imageName = 'gcmAgree_' + nameRun + '_' + scenD[nameScen];
  return ui.Map.Layer(image, figP.visNumGcm, imageName);
};

// add RGB layer to dictionary ----------------------------------------------------------

// contributions by each Q compontent to changes 

var qBands = ['Q1raw', 'Q2raw', 'Q3raw'];


// R = sage, G = perennials, B = annuals
var visRgb = {
  bands: qBands,
  min: 0,
  max: 1
};

var loadRgb = function(nameRun, nameScen){
    var root =  runD[nameRun] + '_';
    var scen = scenD[nameScen];
    var RCP = scen.match('RCP[0-9]{2}')[0];
    var epoch = scen.match('[0-9]{4}-[0-9]{4}$')[0];
    
    var d = lyr.main({
      root: root,
      epoch: epoch,
      RCP: RCP
    });
  
    var diffRedImg2 = ee.Image(d.get('diffRed2Img'));
    var image = ee.Image(d.get('qPropMed2'))
    // areas with < 0.01 delta sei are shown as grey
      .where(diffRedImg2.select('Q5s_median').abs().lt(0.01), 211/255);
    var imageName = 'rgb_' + nameRun + '_' + scenD[nameScen];
    return ui.Map.Layer(image, visRgb, imageName);
};

// load historical layers ------------------------------------------------------------------

var histSEI = ee.Image(pathPub + 'SEI-Q_v11_2017-2020')
  .rename('SEI, Q1, Q2, Q3, Q4, Q5');
  
var histSEI

print(ee.Image(pathPub + 'SEI_Default_RCP45_2031-2060').bandNames())

// make this inside server side map functions? probably still won't work because of the call
// to ee.Image() inside lyr.main()?
/*runNames.forEach(function(nameRun) { // iterating over the images for the different runs
  scenNames.forEach(function(nameScen) {
    var root =  runD[nameRun] + '_';
    var scen = scenD[nameScen];
    var RCP = scen.match('RCP[0-9]{2}')[0];
    var epoch = scen.match('[0-9]{4}-[0-9]{4}$')[0];
    
    var d = lyr.main({
      root: root,
      epoch: epoch,
      RCP: RCP
    });
  
    var diffRedImg2 = ee.Image(d.get('diffRed2Img'));
    var forRgb = ee.Image(d.get('qPropMed2'))
    // areas with < 0.01 delta sei are shown as grey
      .where(diffRedImg2.select('Q5s_median').abs().lt(0.01), 211/255);
    var newKey = 'rgb_' + nameRun + '_' + scenD[nameScen];
    dict = dict.set(newKey, forRgb);
  });
});*/



// testing

var r = Object.keys(runD)[0]
var s = Object.keys(scenD)[0]
/*
Map.layers().add(loadGcmAgree(r, s))
Map.layers().add(loadRgb(r, s))
*/

