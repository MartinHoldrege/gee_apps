

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
  'Juniperus californica' : 'juniperus_californica',
  'Juniperus deppeana' : 'juniperus_deppeana',
  'Juniperus monosperma' : 'juniperus_monosperma',
  'Juniperus occidentalis' : 'juniperus_occidentalis',
  'Juniperus osteosperma' : 'juniperus_osteosperma',
  'Juniperus scopulorum' : 'juniperus_scopulorum',
  'Pinus cembroides' : 'pinus_cembroides',
  'Pinus edulis' : 'pinus_edulis',
  'Pinus monophylla' : 'pinus_monophylla'
};

// scenarios
var scenD = {
  'Current climate': 'current',
  'SSP2-4.5 (2040–2060)': '245mid',
  'SSP3-7.0 (2040–2060)': '370mid',
  'SSP5-8.5 (2040–2060)': '585mid',
  'SSP2-4.5 (2080–2100)': '245end',
  'SSP3-7.0 (2080–2100)': '370end',
  'SSP5-8.5 (2080–2100)': '585end',
};

var varTypeD = {
  'Suitability': 'suitability',
  'Change in suitability': 'suitability_change',
  'Change in suitability category': 'robust_category'
};

// load functions ------------------------------------------------------------

var blankLayer = function() {
  ui.Map.Layer(ee.Image(0).selfMask(), {}, 'layer does not exist', false);
};

// load the image that has multipbe bands (i.e. one for each variable, and the transparency/mask layer)
var loadImage = function(spName) {
  var imagePath = path + spD[spName] + '_suitability_layers_01102025';
  return ee.Image(imagePath);
};

var loadTransp = function(varName, spName, scenName) {
  
  // don't want the transparency to load if there is no actual data layer
  if(varTypeD[varName] !== 'suitability' & scenD[scenName] === 'current') {
    return blankLayer();
  }
  
  var img = loadImage(spName);
  var mask = img.select('current_suitability').gte(ee.Image(-1)) 
    .unmask(); // exclude non study area places
  var transparency = ee.Image(0)
    // these are places that should be covered by a white transparency layer
    // ie. to partially obscure areas where the sp. isn't currently found
    .where(img.select('transparency_mask_binary').eq(1), ee.Image(0.5))
    .selfMask()
    .updateMask(mask);
    
  var cover = ee.Image(1).mask(transparency);
    
  return ui.Map.Layer(cover, {palette: 'white'}, 'add transparency to area outside current range');
};

var loadSuit =  function(spName, scenName) {
  var scen = scenD[scenName];
  
  if (scen === 'current') {
    var lyrName = 'current_suitability';
  } else {
    var lyrName = 'suitability_' + scen;
  }
 
  var image = loadImage(spName);
  
  var img = ee.Image(image).select(lyrName); 
  var imageName = spD[spName] + '_' + lyrName;
  return ui.Map.Layer(img, figP.visCurSuit, imageName);
};


var loadDeltaSuit = function(spName, scenName) {

  var scen = scenD[scenName];
  
  // delta layers can't have 'current' values
  if (scen === 'current') {
    return blankLayer()
  }
  var image = loadImage(spName);
  var lyrName = 'suitability_change_' + scen;
  var img = ee.Image(image).select(lyrName); 
  var imageName = spD[spName] + '_' + lyrName;
  return ui.Map.Layer(img, figP.visDeltaSuit, imageName);
};


var loadDeltaRobust = function(spName, scenName) {

  var scen = scenD[scenName];
    // delta layers can't have 'current' values
  if (scen === 'current') {
    return blankLayer();
  }
  var image = loadImage(spName);
  var lyrName = 'robust_category_' + scen;
  var img = ee.Image(image).select(lyrName); 
  var imageName = spD[spName] + '_' + lyrName;
  return ui.Map.Layer(img, figP.visDeltaRobust, imageName);
};

// Dictionary containing load functions ------------------------------------------------

// load functions for 'future' layers
var loadFunsD = {
  'suitability': loadSuit,
  'suitability_change': loadDeltaSuit,
  'robust_category': loadDeltaRobust
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
exports.exampleImage = image; // this is for centering the map. 

// testing

var spName = Object.keys(spD)[0];
var scenName = Object.keys(scenD)[0];
var varName = Object.keys(varTypeD)[1];
print(spName, scenName, varName)
// Map.layers().add(loadSuit(spName, scenName));
Map.layers().add(loadLayer(varName, spName, scenName));
// Map.layers().add(loadDeltaRobust(spName, scenName));
// Map.layers().add(loadTransp(spName));


