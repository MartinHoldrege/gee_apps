/*
Purpose: Create a visualization of the main data layers in the new RR dataset (Schlaepfer et al.)

Author: Martin Holdrege

Started: October 14, 2024
*/


// dependencies -----------------------------------------------------------------------------

var figp = require("users/MartinHoldrege/gee_apps:src/fig_params.js");
var f = require("users/MartinHoldrege/gee_apps:src/general_functions.js");
// params ---------------------------------------------------------------------------------

var path = 'projects/ee-martinholdrege/assets/misc/newRR3/'; // where images are read in from

// visualization params
var visT1 = figp.visT1;
var visT2 = figp.visT2;
var visT3 = figp.visT3;


var testRun = false; // fewer images displayed for test run
// read in layers ---------------------------------------------------------------------------

var mask = ee.Image(path + 'negMask');

// note--this list of image names and visparms was created in 00_newRR_file-name_lists.R
// and then pasted here
// these file names are used to read in images below, an
var imageNamesL = ['Resist-cats_2064-2099-RCP85', 'Resist-cont_2064-2099-RCP85', 'Resil-cats_2064-2099-RCP85', 
'Resil-cont_2064-2099-RCP85', 'Resist-cont_2064-2099-RCP85-delta', 'Resil-cont_2064-2099-RCP85-delta', 
'Resist-cats_2029-2064-RCP85', 'Resist-cont_2029-2064-RCP85', 'Resil-cats_2029-2064-RCP85', 'Resil-cont_2029-2064-RCP85',
'Resist-cont_2029-2064-RCP85-delta', 'Resil-cont_2029-2064-RCP85-delta', 'Resist-cats_2064-2099-RCP45', 
'Resist-cont_2064-2099-RCP45', 'Resil-cats_2064-2099-RCP45', 'Resil-cont_2064-2099-RCP45', 'Resist-cont_2064-2099-RCP45-delta', 
'Resil-cont_2064-2099-RCP45-delta', 'Resist-cats_2029-2064-RCP45', 'Resist-cont_2029-2064-RCP45', 'Resil-cats_2029-2064-RCP45', 
'Resil-cont_2029-2064-RCP45', 'Resist-cont_2029-2064-RCP45-delta', 'Resil-cont_2029-2064-RCP45-delta', 'Resist-cats_1980-2020-Ambient',
'Resist-cont_1980-2020-Ambient', 'Resil-cats_1980-2020-Ambient', 'Resil-cont_1980-2020-Ambient'];

var visParamsL = [visT2, visT1, visT2, visT1, visT3, visT3, visT2, visT1, visT2, visT1, visT3, visT3, visT2, visT1, visT2, visT1, 
visT3, visT3, visT2, visT1, visT2, visT1, visT3, visT3, visT2, visT1, visT2, visT1];

if (testRun) {
  var imageNamesL = imageNamesL.slice(0, 3);
}

// setup ---------------------------------------------------

ui.root.clear();
//var panel = ui.Panel({style: {width: '250px'}});
var map = ui.Map();
//ui.root.add(panel).add(map); // order that you add panl vs map affects if panel is right or left
ui.root.add(map); 

map.style().set('cursor', 'crosshair');
map.centerObject(mask, 6);


///////////////////////////////////////////////////////////////
//      Set up panels and widgets for display             //
///////////////////////////////////////////////////////////////

// style elements for text
var mt = '10px'; var mr = ' 10px'; var mb = ' 10px'; var ml = ' 10px'; // top, right, bottom and left margins
var margin = mt + mr + mb + ml;
var marginNoTB = '0px' + mr + ' 0px' + ml; // no top and bottom margines
var marginNoT = '0px' + mr + mb + ml; // no top  margin's
var marginNoB = mt + mr + ' 0px' + ml; // no bottom  margin's
var fontSizeText = '11px';
var styleText = {fontSize: fontSizeText, margin: mt + mr + mb + ml};
var styleTextNoTB =  f.updateDict(styleText, 'margin', marginNoTB);
var styleHeader = {fontSize: '15px', fontWeight: 'bold'};

var styleUrl = {
  fontSize: fontSizeText, 
  color: 'blue', 
  textDecoration: 'underline',
  margin: marginNoTB
};

// Set up title and summary widgets

//App title
var title = ui.Label('Resistance and Resilience Projections', {fontSize: '18px', fontWeight: 'bold', color: '4A997E'});

// Create a panel to hold text
var panel = ui.Panel({
  widgets:[title],//Adds header and text
  style:{width: '300px',position:'middle-left'}});




// Add our main panel to the root of our GUI
ui.root.insert(1,panel);

// add legends  -------------------------------

//map.add(figp.legendsRr);


///////////////////////////////////////////////////////////////
//      add maps                                            //
///////////////////////////////////////////////////////////////

for (var i = 0; i < imageNamesL.length; i++) {
  var imageName = imageNamesL[i];
  var vis = visParamsL[i];
  
  // by default have one layer display
  if(imageName == 'Resil-cats_1980-2020-Ambient') {
    var shown =true;
  } else {
    var shown = false;
  }
  var image = ee.Image(path + imageName);
  map.addLayer(image, vis, imageName, shown);

}

map.addLayer(mask, {palette: 'white'}, 'mask non-sagebrush rangelands', true);
