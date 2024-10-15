/*
Purpose: Create a visualization of the main data layers in the new RR dataset (Schlaepfer et al.)

Author: Martin Holdrege

Started: October 14, 2024
*/

// dependencies -----------------------------------------------------------------------------


// params ---------------------------------------------------------------------------------

var path = 'projects/ee-martinholdrege/assets/misc/newRR3/'; // where images are read in from
var fontText = '10px'; // font size for general descriptions etc. 

// read in layers ---------------------------------------------------------------------------

var mask = ee.Image(path + 'negMask');

// for testing
var imagetype1 = ee.Image(path + 'Resil-cats_2029-2064-RCP45');
var imagetype2 = ee.Image(path + 'Resil-cont_2029-2064-RCP45');
var imagetype3 = ee.Image(path + 'Resil-cont_2029-2064-RCP45-delta');

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

var styleText = {fontSize: '11px'};
var styleHeader = {fontSize: '15px', fontWeight: 'bold'};

//3.1) Set up title and summary widgets

//App title
var title = ui.Label('Resistance and Resilience Projections', {fontSize: '18px', fontWeight: 'bold', color: '4A997E'});

//3.2) Create a panel to hold text
var panel = ui.Panel({
  widgets:[title],//Adds header and text
  style:{width: '400px',position:'middle-right'}});


//This creates another panel to house a line separator and instructions for the user

// first paragraph
var par1 = 'This app visualizes the impacts of projected future climate on' +
' resistance to cheatgrass invasion and ecological resilience (R&R) in the' + 
'sagebrush region using algorithms based on ecologically relevant and ' + 
'climate-sensitive predictors of climate and ecological drought.';

// 2nd paragraph
var par2 = 'Data are available from https://doi.org/10.5066/P928Y2GF. ' + 
'Published article with further details is available from XXX.';

// how to use
var howTo = 'Select layer(s) to view from the dropdown "Layers" menu.' +
    'Note, by default the mask is selected so that only projections from sagebrush rangelands are shown.'

// abbrevations
var abbrev = 'resil = ecological resilience indicator;' + 
' resist = invasion resistance indicator; cont = continuous R&R indicator;' + 
' cats = categorical R&R indicator (L = low, ML = medium-low, M = medium, ' + 
'H+MH = medium-high to high); RCP = representative concentration pathway;' + 
' delta = difference between projected future R&R and historical reference.';

var emptyLine =  ui.Label({
    value: '            ',
    style: styleText,
  });
  
var description = ui.Panel([
  ui.Label({
    value:'Description',
    style: styleHeader,
  }),
  ui.Label({
    value: par1,
    style: styleText
  }),
  ui.Label({
    value: par2,
    style: styleText
  }),
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
panel.add(description)

//3.4) Add our main panel to the root of our GUI
ui.root.insert(1,panel)


