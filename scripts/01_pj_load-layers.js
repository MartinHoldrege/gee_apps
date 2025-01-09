

// dependencies ----------------------------------------------------------------------------

var figP = require("users/MartinHoldrege/gee_apps:src/fig_params_pj.js");


// parameters ------------------------------------------------------------------------------
// load data (to put in own scripts)
var path = 'projects/ee-martinholdrege/assets/misc/pj_niche/'; // where images are read in from

var image = ee.Image(path + 'pinus_edulis_gee_test_layers_01072025'); // this is just temporary

// helper dictionaries -----------------------------------------------------------
// for various 'lookup' tasks

// names of the different types of runs
var spD = {
  'Pinus edulis': 'pinus_edulis'
};

// scenarios
var scenD = {
  'SSP2-4.5 (2081–2100)': '245end'
};

var varTypeD = {
  'Current suitability': 'current_suit',
  'Change in suitability': 'change_suit',
  'Change in suitability category': 'change_robust'
};

// load functions ------------------------------------------------------------

// load the image that has multipbe bands (i.e. one for each variable, and the transparency/mask layer)
var loadImage = function(spName, scenName) {
  var imagePath = path + 'pinus_edulis_gee_test_layers_01072025';
  return ee.Image(imagePath);
};

var loadTransp = function(spName) {
  var img = image;
  var mask = img.select('current_suit').gte(ee.Image(-1))
    .unmask(); // exclude non study area places
  var transparency = ee.Image(0)
    // these are places that should be covered by a white transparency layer
    // ie. to partially obscure areas where the sp. isn't currently found
    .where(img.select('transparency').eq(1), ee.Image(0.5))
    .selfMask()
    .updateMask(mask);
    
  var cover = ee.Image(1).mask(transparency);
    
  return ui.Map.Layer(cover, {palette: 'white'}, 'cover areas where spp not found');
};

var loadCurSuit =  function(spName, scenName) {
  // scenName is just a dummy argument here, not used, to 
  // make inputs same as other functions
  var img = ee.Image(image).select('current_suit'); // temporary
  var imageName = spD[spName] + '_current-suitability';
  return ui.Map.Layer(img, figP.visCurSuit, imageName);
};


var loadDeltaSuit = function(spName, scenName) {
  var img = image.select('change_suit'); // temporary
  var imageName = spD[spName] + '_' + scenD[scenName] + '_delta-suitability';
  return ui.Map.Layer(img, figP.visDeltaSuit, imageName);
};


var loadDeltaRobust = function(spName, scenName) {
  var img = image.select('change_robust'); // temporary
  var imageName = spD[spName] + '_' + scenD[scenName] + '_robust';
  return ui.Map.Layer(img, figP.visDeltaRobust, imageName);
};

// Dictionary containing load functions ------------------------------------------------

// load functions for 'future' layers
var loadFunsD = {
  'current_suit': loadCurSuit,
  'change_suit': loadDeltaSuit,
  'change_robust': loadDeltaRobust
};

// loads the layers for the given variable, species and scenario
var loadLayer = function(varName, spName, scenName) {
  var varType = varTypeD[varName];
  var f = loadFunsD[varType];
  return f(spName, scenName);
};


// exports ---------------------------------------------------------------

exports.loadLayer = loadLayer;
exports.spD = spD;
exports.varTypeD = varTypeD;
exports.scenD = scenD;
exports.loadTransp = loadTransp;

// testing
/*
var spName = Object.keys(spD)[0];
var scenName = Object.keys(scenD)[0];
var varName = Object.keys(varTypeD)[1];

Map.layers().add(loadCurSuit(spName, scenName));
Map.layers().add(loadLayer(varName, spName, scenName));
Map.layers().add(loadDeltaRobust(spName, scenName));
Map.layers().add(loadTransp(spName));
*/

