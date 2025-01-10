/*
  Purpose: Create functions for loading layers for each variable
  type that will be shown in the app. 
  
  Note most of the functions defined here rely on objects
  that are in the environment, so shouldn't be copied and defined elsewhere. 

  Author: Martin Holdrege
  
  Started: October 28, 2024
*/


// dependencies --------------------------------------------------------------------

var f = require('users/MartinHoldrege/gee_apps:src/general_functions.js');
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


// add numGCM good to dictionary -----------------------------------------------------

// agreement on change in SEI class (i.e. type of map shown in fig 2 of Holdrege et al. 2024)
var loadNumAgree =  function(nameRun, nameScen) {
  var image = ee.Image(pathProducts + v + '_numGcmGood_' + resolution + '_' + runD[nameRun] + '_mode')
    .select('numGcmGood_' + scenD[nameScen]);

  var imageName = 'gcmAgree_' + nameRun + '_' + scenD2[nameScen];
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
    var imageName = 'rgb_' + nameRun + '_' + scenD2[nameScen];
    return ui.Map.Layer(image, visRgb, imageName);
};

// load historical layers ------------------------------------------------------------------

// note when the rasters were ingested into gee they lost they're band names
// this is the order of the names in the original tifs (checked in R)

var histSEI = ee.Image(pathPub + 'SEI-Q_v11_2017-2020')
  .rename('Q5s', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5'); // Q5s is the continuous SEI

var histQ5sc3 = SEI.seiToC3(histSEI.select('Q5s')); // historical 3 class SEI
var histSEI = histSEI.addBands(histQ5sc3);

var yrs = '_2017-2020';
var histLayersD = {
  'none': function() {return ui.Map.Layer(ee.Image(0).selfMask(), {}, 'No historical layer shown', false)},
  'SEI': function() {return ui.Map.Layer(histSEI.select('Q5s'), figP.visSEI, 'SEI' + yrs)},
  'c3': function() {return ui.Map.Layer(histSEI.select('Q5sc3'), figP.visc3, 'c3' + yrs)},
  'Q1': function() {return ui.Map.Layer(histSEI.select('Q1'), figP.visSEI, 'Q1' + yrs)},
  'Q2': function() {return ui.Map.Layer(histSEI.select('Q2'), figP.visSEI, 'Q2' + yrs)},
  'Q3': function() {return ui.Map.Layer(histSEI.select('Q3'), figP.visSEI, 'Q3' + yrs)},
  'Q4': function() {return ui.Map.Layer(histSEI.select('Q4'), figP.visSEI, 'Q4' + yrs)},
  'Q5': function() {return ui.Map.Layer(histSEI.select('Q5'), figP.visSEI, 'Q5' + yrs)}
};

// names to be used in dropdown menu of layers in histLayersD
var histNamesD = {
  "None selected": 'none',
  'SEI class': 'c3',
  'SEI (continuous)': 'SEI',
  "Q1 ('quality' score of sagebrush)": 'Q1',
  "Q2 ('quality' score of perennials)": 'Q2',
  "Q3 ('quality' score of annuals)": 'Q3',
  "Q4 ('quality' score of human modification)": 'Q4',
  "Q5 ('quality' score of conifers)": 'Q5'
};


// Change in SEI ---------------------------------------------------------------------------
// absolute change in SEI relative to historical

var getFutSEI = function(nameRun, nameScen) {
  var pathImage = pathPub + 'SEI_' + nameRun + '_' + scenD2[nameScen];
  var futSEI = ee.Image(pathImage)
    .rename(['SEI_low', 'SEI_high', 'SEI_median'])
    .select('SEI_median');
    
  return futSEI;
};

var loadSEIClass = function(nameRun, nameScen) {
  var image = SEI.seiToC3(getFutSEI(nameRun, nameScen));
  var imageName = 'c3_' + nameRun + '_' + scenD2[nameScen];
  return ui.Map.Layer(image, figP.visc3, imageName);
};

var loadDeltaSEI = function(nameRun, nameScen) {
  
  var futSEI = getFutSEI(nameRun, nameScen);
  var deltaSEI = futSEI.subtract(histSEI.select('Q5s'));
  var imageName = 'deltaSEI_' + nameRun + '_' + scenD2[nameScen];
  
  return ui.Map.Layer(deltaSEI.sldStyle(figP.sldDiff1), {}, imageName);
};

// percent change in Qs --------------------------------------------------------

// Q argument should be a string 'Q1' 'Q2' or 'Q3'

// returns a load function for a particular Q
var loadDeltaQFactory = function(Q) {
  var bandNames = ['Q1_low', 'Q2_low', 'Q3_low', 'Q1_high', 
    'Q2_high', 'Q3_high', 'Q1_median', 'Q2_median', 'Q3_median'];
 
  var f = function(nameRun, nameScen) {
    var pathImage = pathPub + 'Q_' + nameRun + '_' + scenD2[nameScen];
    var futQ = ee.Image(pathImage)
      .rename(bandNames)
      .select(Q + '_median');
    var histQ = histSEI.select(Q);
    var deltaQ = futQ.subtract(histQ).divide(histQ) // proportion change
      .multiply(100); // converted to percent change
    var imageName = 'percentChange' + Q + '_' + nameRun + '_' + scenD2[nameScen];
    return ui.Map.Layer(deltaQ.sldStyle(figP.sldDeltaQ), {}, imageName);  
  };
  return f;
};

var loadDeltaQ1 = loadDeltaQFactory('Q1');
var loadDeltaQ2 = loadDeltaQFactory('Q2');
var loadDeltaQ3 = loadDeltaQFactory('Q3');


// change in SEI class -------------------------------------------------------------

// the c9 images for default simulations are available as pre-created layers
var getDefaultC9 = function(nameScen) {
  var pathImage = pathPub + 'c9_Default' + '_' + scenD2[nameScen];
  var image = ee.Image(pathImage)
    .rename('c9_low', 'c9_median', 'c9_high')
    .select('c9_median');
  return image;
};

var loadC9 = function(nameRun, nameScen) {
  // for now calculating on c9 on fly for Default, because the c9 asset has weird 
  // pyramiding that causes black dots on map at high pyramid levels
  // if (nameRun === 'Default') { 
  if (false) {
    var c9 = getDefaultC9(nameScen);
  } else {
    // calculating SEI class
    var futC3 = SEI.seiToC3(getFutSEI(nameRun, nameScen)); // future c3
    var c9 = SEI.calcTransitions(histSEI.select('Q5sc3'), futC3);
  }
  var imageName = 'c9_' + nameRun + '_' + scenD2[nameScen];
  return ui.Map.Layer(c9, figP.visC9, imageName);
};

// a blank layer
var loadNone = function(nameRun, nameScen) {
  return ui.Map.Layer(ee.Image(0).selfMask(), {}, 'blank layer', false);
};

// Dictionary containing load functions ------------------------------------------------

// load functions for 'future' layers
var loadFutFunsD = {
  'none': loadNone,
  'c3': loadSEIClass,
  'SEI': loadDeltaSEI,
  'c9': loadC9,
  'Q1': loadDeltaQ1,
  'Q2': loadDeltaQ2,
  'Q3': loadDeltaQ3,
  'rgb': loadRgb,
  'numAgree': loadNumAgree
};

// loads the layers for the given vartype, name of the run and name of the 
// climate scenario
var loadFutLayer = function(varType, nameRun, nameScen) {
  var f = loadFutFunsD[varType];
  return f(nameRun, nameScen);
};

// exports ---------------------------------------------------------------
exports.loadFutLayer = loadFutLayer;
exports.histLayersD = histLayersD;
exports.histNamesD = histNamesD;
exports.scenD = scenD;
exports.histSEI = histSEI; 

// testing

/*
var r = Object.keys(runD)[1];
var s = Object.keys(scenD)[1];
Map.layers().add(loadNumAgree(r, s))
Map.layers().add(loadRgb(r, s))
Map.layers().add(loadDeltaSEI(r, s))
Map.layers().add(loadDeltaQ1(r, s));
Map.layers().add(loadC9(r, s));
Object.keys(histLayersD).forEach(function(key) {
  Map.layers().add(histLayersD[key])
});
*/
