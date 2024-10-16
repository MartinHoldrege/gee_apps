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

var testRun = true; // fewer images displayed for test run
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
var marginNoTB = '0px 10px 0px 10px'; // no top and bottom margines
var styleText = {fontSize: '11px', margin: '10px 10px 10px 10px'};
var styleHeader = {fontSize: '15px', fontWeight: 'bold'};

var styleUrl = {
  fontSize: '11px', 
  color: 'blue', 
  textDecoration: 'underline',
  margin: marginNoTB
};

//3.1) Set up title and summary widgets

//App title
var title = ui.Label('Resistance and Resilience Projections', {fontSize: '18px', fontWeight: 'bold', color: '4A997E'});

// Create a panel to hold text
var panel = ui.Panel({
  widgets:[title],//Adds header and text
  style:{width: '250px',position:'middle-left'}});


// text for the main panel

// first paragraph
var par1 = 'This app visualizes the impacts of projected future climate on' +
' resistance to cheatgrass invasion and ecological resilience (R&R) in the ' + 
'sagebrush region using algorithms based on ecologically relevant and ' + 
'climate-sensitive predictors of climate and ecological drought.';

// 2nd paragraph
var par2a =    ui.Label({
    value: 'Data shown here are available from',
    style: f.updateDict(styleText, 'margin', marginNoTB), // no bottom margin
  });

var par2b =    ui.Label({
    value: 'https://doi.org/10.5066/P928Y2GF.',
    targetUrl: 'https://doi.org/10.5066/P928Y2GF',
    style: styleUrl
  });

// CONTINUE HERE
var par3a = 'Further details about the research that developed these ' + 
'projections can be found in Schlaepfer et al. (In press) (link TBD).';

var par3b = 'Specific information about how the R&R algorithms themselves can ' +
'be found in '; // put chambers link here

// how to use
var howTo = 'Select layer(s) to view from the dropdown "Layers" menu. ' +
    'Note, by default the mask layer is selected so that only projections from' +
    ' sagebrush rangelands are shown, and other areas are covered.';

// abbrevations
var abbrev = 'resil = ecological resilience indicator;' + 
' resist = invasion resistance indicator; cont = continuous R&R indicator;' + 
' cats = categorical R&R indicator (L = low, ML = medium-low, M = medium, ' + 
'H+MH = medium-high to high); RCP = representative concentration pathway;' + 
' delta = difference between projected future R&R and historical reference.';


var description = ui.Panel([
  ui.Label({
    value:'Description',
    style: styleHeader,
  }),
  ui.Label({
    value: par1,
    style: styleText
  }),
  par2a, par2b,
  ui.Label({
    value:'How to Use',
    style: styleHeader,
  }),
  ui.Label({
    value: howTo,
    style: styleText
  }),
  ui.Label({
    value:'Abbreviations',
    style: styleHeader,
  }),
  ui.Label({
    value: abbrev,
    style: styleText
  }),
  ui.Label({
    value:'Disclaimer',
    style: styleHeader,
  }),
  ui.Label({
    value: 'This app is not official and comes with absolutely no warranty.',
    style: styleText
  }),
]);

//Add this new panel to the larger panel we created 
panel.add(description);

// Add our main panel to the root of our GUI
ui.root.insert(1,panel);

// add legends  -------------------------------

map.add(figp.legendsRr);


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
