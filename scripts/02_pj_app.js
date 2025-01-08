

// dependencies ----------------------------------------------------------------------------

var figP = require("users/MartinHoldrege/gee_apps:src/fig_params_pj.js")


// parameters ------------------------------------------------------------------------------
// load data (to put in own scripts)
var path = 'projects/ee-martinholdrege/assets/misc/pj_niche/'; // where images are read in from

var image = ee.Image(path + 'pinus_edulis_gee_test_layers_01072025'); // this is just temporary


// helper dictionaries -----------------------------------------------------------
// for various 'lookup' tasks

// names of the different types of runs
var sppD = {
  'Pinus edulis': 'pinus_edulis'
};

// scenarios
var scenD = {
  'SSP2-4.5 (2081–2100)': '245end'
};

var varTypeD = {
  'Current suitability': 'current_suit',
  'Change in suitability': 'change_suit',
  'Suitability category': 'change_robust'
};

// load functions ------------------------------------------------------------

// load the image that has multipbe bands (i.e. one for each variable, and the transparency/mask layer)
var loadImage = function(sppName, scenName) {
  var imagePath = path + 'pinus_edulis_gee_test_layers_01072025';
  return ee.Image(imagePath);
};

var loadCurSuit =  function(sppName) {
  var image = image.select('current_suit'); // temporary
  var imageName = sppD[sppName] + '_current-suitability';
  return ui.Map.Layer(image, figP.visCurSuit, imageName);
};


var loadDeltaSuit = function(sppName, ScenName) {
  var image = image.select('delta_suit'); // temporary
  var imageName = sppD[sppName] + '_' + scenD[scenName] + '_delta-suitability';
  return ui.Map.Layer(image, figP.visDeltaSuit, imageName);
};








