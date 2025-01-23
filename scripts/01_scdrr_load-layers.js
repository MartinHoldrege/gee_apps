/*
  Functions and dictionaries for displaying layers that overlay sagebrush
  ecological integrity (SEI) and Resistance and Resilience (R&R) projections
  This is a module loaded by other scripts (namely 02_scdrr_app.js)
  
  Author: Martin Holdrege
  
  Started: November 13, 2025
*/


// dependencies ---------------------------------------------------------

// all data processing will happen in the scd_rr repository
// only display code will be written in the gee_apps repository

var over = require("users/MartinHoldrege/scd_rr:src/overlay.js");
var load = require("users/MartinHoldrege/scd_rr:src/load.js");
var figP = require("users/MartinHoldrege/gee_apps:src/fig_params_scdrr.js");

// helper dictionaries ------------------------------------------------- 
// for various 'lookup' tasks

var scenD = {
  'Historical climate': 'historical',
  'RCP 4.5 (2031-2060)':'RCP45_2031-2060',
  'RCP 4.5 (2071-2100)': 'RCP45_2071-2100',
  'RCP 8.5 (2031-2060)': 'RCP85_2031-2060',
  'RCP 8.5 (2071-2100)': 'RCP85_2071-2100'
};

var varTypeD = {
  'SEI class & resilience class overlay': 'c3_resil',
  'SEI class & resistance class overlay': 'c3_resist',
  'Change in SEI and resilience classes': 'classChange_resil',
  'Change in SEI and resistance classes': 'classChange_resist'
};

// create masks;

var c3 = load.getC3({scen: 'historical'});
var resil = load.getRr({
  varName: 'Resil-cats', 
  scen: 'historical',
  rr3Class: true
});

var resist = load.getRr({
  varName: 'Resist-cats', 
  scen: 'historical',
  rr3Class: true
});


var maskD = {
  'Show all sagebrush rangelands': c3.gte(1).unmask(),
  'Only show current CSA': c3.eq(1).unmask(),
  'Only show current GOA': c3.eq(2).unmask(),
  'Only show current ORA': c3.eq(3).unmask(),
  'Only show current L resistance': resist.eq(1),
  'Only show current LM resistance': resist.eq(2),
  'Only show current M+H resistance': resist.eq(3),
  'Only show current L resilience': resil.eq(1),
  'Only show current LM resilience': resil.eq(2),
  'Only show current M+H resilience': resil.eq(3)
};


// load functions --------------------------------------------------------


var loadEmpty = function() {
  return ui.Map.Layer(ee.Image(0).selfMask(), {}, 'selected layer does not exist', false)
}

// load layers that provide the 9 categories of SEI class and RR class
// for a given time-period (i.e. both sei and rr are for that time-period)

// function factory

var loadC3RrFactory = function(rrVar) {
  
  var f = function(scenName, maskName) {
    var scen = scenD[scenName];
    var image = over.createC3RrOverlay({
      scenRr: scen,
      varName: rrVar, //  Resist-cats or Resil-cats
      rr3Class: false,
      remap: true
    });
    
    var mask = maskD[maskName];
    
    var imageName = 'SEI class, ' + rrVar + ' ' + scen;
    return ui.Map.Layer(image.updateMask(mask), figP.visC3Rr1, imageName, true);
    
  };
  
  return f;
};

// the actuall load functions
var loadC3Resist = loadC3RrFactory('Resist-cats');
var loadC3Resil = loadC3RrFactory('Resil-cats');


var loadClassChangeFactory = function(rrVar) {
  
  var f = function(scenName, maskName) {
    
    var scen = scenD[scenName];
    
    if (scen === 'historical') {
      return loadEmpty();
    }
    var image = over.classChangeAgree({
      scen: scen,
      varName: rrVar, //  Resist-cats or Resil-cats
      rr3class: false,
    });
    
    var mask = maskD[maskName];
    
    var imageName = 'change in SEI and ' + rrVar + 'classes, ' + scen;
    return ui.Map.Layer(image.updateMask(mask), figP.visClassChange1, imageName, true);
    
  };
  
  return f;
};

var loadClassChangeResil = loadClassChangeFactory('Resil-cats');
var loadClassChangeResist = loadClassChangeFactory('Resist-cats');

// Dictionary containing load functions ------------------------------------------------

// load functions for 'future' layers
var loadFunsD = {
  'c3_resil': loadC3Resil,
  'c3_resist':loadC3Resist,
  'classChange_resil': loadClassChangeResil,
  'classChange_resist': loadClassChangeResist
};

// loads the layers for the given variable, species and scenario
var loadLayer = function(varName, scenName, maskName) {
  
  var varType = varTypeD[varName];
  var f = loadFunsD[varType];
  return f(scenName, maskName);
};

// exports ---------------------------------------------------------------

exports.loadLayer = loadLayer
exports.scenD = scenD;
exports.varTypeD = varTypeD;
exports.maskD = maskD;
exports.c3Hist = c3;
// testing  --------------------------------------------------
 
 if (true) {
  var scen = 'RCP45_2031-2060';
  var image  = over.createC3RrOverlay({
        scenRr: scen,
        scenScd: scen,
        varName: 'Resil-cats', //  Resist-cats or Resil-cats
        rr3class: true,
        remap: true
      });
    
  // print(image)
  // next steps--don't require reprojection for the app 
   
   
   
 var varName = Object.keys(varTypeD)[0];
 var scenName = Object.keys(scenD)[0];
 var maskName = Object.keys(maskD)[0];
 print(varName, scenName, maskName)
 Map.layers().add(loadLayer(varName, scenName, maskName));
   
   
 }
