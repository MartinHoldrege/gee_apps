// functions, etc. that load layers for the PJ community suitability app

// dependencies ----------------------------------------------------------------------------

var figP = require("users/MartinHoldrege/gee_apps:src/fig_params_pjcom.js");


// parameters ------------------------------------------------------------------------------
// load data (to put in own scripts)
var path = 'projects/ee-martinholdrege/assets/misc/pjcom/'; // where images are read in from


// helper dictionaries -----------------------------------------------------------
// for various 'lookup' tasks

var visD = figP.visD; // dictionary of visualization parameters

// names of the different types scenarios
var scenD = {
  'Current climate': 'current',
  'SSP2-4.5 (2041–2060)': '245mid',
  'SSP3-7.0 (2041–2060)': '370mid',
  'SSP5-8.5 (2041–2060)': '585mid',
  'SSP2-4.5 (2081–2100)': '245end',
  'SSP3-7.0 (2081–2100)': '370end',
  'SSP5-8.5 (2081–2100)': '585end',
};

// variables
var varTypeD = {
  'Community suitability': 'cs',
  'HCFS (historic contribution to future suitability, a measure of refugia potential)*' :'hcfs',
  'Community suitability & HCFS*': 'cs_hcfs_biclass',
  'Community suitability & PJ MOG (mature & old-growth)': 'cs_mog_biclass',
  'Community suitability & BP (burn probability)': 'cs_bp_biclass',
  'Climate adaptation category*': 'clim_adap_category'
};

var reverseDictionary = function(x) {
  var reverse = {};
  for (var k in x) {
    if (x.hasOwnProperty(k)) {
      reverse[x[k]] = k;
    }
  }
  return  reverse;
};
// reverse dictionary: value → key
var reverseVarTypeD = reverseDictionary(varTypeD);
print(reverseVarTypeD);


// variables that don't have values for current climate conditions (future only)
var varFutOnly = ['hcfs', 'cs_hcfs_biclass', 'cs_bp_biclass', 'clim_adap_category'];

// load functions ------------------------------------------------------------

var blankImage = ee.Image(0).selfMask().rename('layer does not exist');

var blankLayer = function() {
  ui.Map.Layer(blankImage, {}, 'layer does not exist', false);
};

// load the band of the image of interest
var loadBand = function(varName, scenName) {
  var varType = varTypeD[varName];
  var scen = scenD[scenName];
  var imagePath;
  if (varType === 'cs' || varType === 'hcfs') {
    imagePath = path + 'pj_overlay_fullwest_numeric_layers';
  } else {
    imagePath = path + 'pj_overlay_fullwest_export_categorical_layers_v2';
  }
  var img = ee.Image(imagePath);
  var bandName = varType + '_' + scen;
  var imgBand;
  if (scen === 'current' && varFutOnly.includes(varType)) {
    imgBand = blankImage;
  } else {
    imgBand = img.select(bandName);
  }
  return imgBand;
};

var loadCsMog = function(scenName) {
  var varType = 'cs_mog_biclass';
  var varName = reverseVarTypeD[varType];
  var img = loadBand(varName, scenName);
  var scen = scenD[scenName];
  
  if(scen === 'current') {
  // The "cs_mog_biclass_current" layer is missing a category, and integer values are slightly different,
  // so remapping to make it match the others
    var name = img.bandNames();
    img = img.remap(
      [1, 2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 5, 6, 7, 8, 9]
      )
      .rename(name[0]);
  }
  return ui.Map.Layer(img, visD[varType], img.bandNames());
};

var loadCsHcfs = function(scenName) {
  var varType = 'cs_hcfs_biclass';
  var varName = reverseVarTypeD[varType];
  var img = loadBand(varName, scenName);

  // original values → new values
  var from = [1, 2, 3, 4,  5, 6, 7, 8,  9, 10, 11, 12, 13];
  var to   = [1, 2, 3, -9999, 4, 5, 6, -9999, 7, 8, 9, -9999, -9999];
  var name = img.bandNames();
  // apply to an image
  var remapped = img.remap(from, to)
    .updateMask(img.remap(from, to).neq(-9999))
    .rename(name[0]);
  return ui.Map.Layer(img, visD[varType], img.bandNames());
};

var loadCsBp = function(scenName) {
  var varType = 'cs_bp_biclasss';
  var varName = reverseVarTypeD[varType];
  var img = loadBand(varName, scenName);

  // original values → new values
  var from = [ 1,  2,  3,     4, 5,  6,  7,     8, 9, 10, 11,    12,    13,    14,    15,    16];
  var to   = [ 1,  2,  3, -9999, 4,  5,  6, -9999, 7,  8,  9, -9999, -9999, -9999, -9999, -9999];

  var name = img.bandNames();
  // apply to an image
  var remapped = img.remap(from, to)
    .updateMask(img.remap(from, to).neq(-9999))
    .rename(name[0]);
  return ui.Map.Layer(img, visD[varType], img.bandNames());
};

// function factory, for load functions for variables that don't need additional custom
// modifications to visualize
var loadFactory = function(varType) {
  var f = function(scenName) {
    var varName = reverseVarTypeD[varType];
    var img = loadBand(varName, scenName);
    var name = img.bandNames()[0];
    return ui.Map.Layer(img, visD[varType], name);
  };
  return f;
};

// dictionary of custom load functions for some variables, 
// other variables rely on the generic load function
var loadFunsD = {
  'cs': loadFactory('cs'),
  'hcfs': loadFactory('hcfs'),
  'cs_mog_biclass': loadCsMog,
  'cs_hcfs_biclass': loadCsHcfs,
  'cs_bp_biclass': loadCsBp,
  'clim_adap_category': loadFactory('clim_adap_category'),
}; 

var loadLayer = function(varName, scenName) {
  var  varType = varTypeD[varName];
  var scen = scenD[scenName];
  if (scen === 'current' && varFutOnly.includes(varType)) {
    return blankLayer();
  }
  var f = loadFunsD[varType];
  return f(scenName);
};


// exports ---------------------------------------------------------------

exports.loadLayer = loadLayer;
exports.varTypeD = varTypeD;
exports.scenD = scenD;


// testing


var scenName = Object.keys(scenD)[1];
var varName = Object.keys(varTypeD)[1];

// Map.layers().add(loadSuit(spName, scenName));
Map.layers().add(loadLayer(varName, scenName));



