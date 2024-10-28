/********************************************************
 * Purpose:
 * Simple app to show basic layers shown in Holdrege et al. 2024 (rangeland ecology and management)
 * Based on the SEI/scripts/06_app_sage-climate-training.js app.
 * 
 * Script Started: October 22, 2024
 * 
 * Author: Martin Holdrege
 * 
 * 
* 
 * *******************************************************
*/ 


// User-defined variables -----------------------------------------------------
 
var root = 'fire1_eind1_c4grass1_co20_2311_';
// dependencies -----------------------------------------------------------

// Load module with functions 
// The functions, lists, etc are used by calling SEI.nameOfObjectOrFunction
var SEI = require("users/MartinHoldrege/SEI:src/SEIModule.js");
var fig = require("users/MartinHoldrege/SEI:src/fig_params.js");
var f = require("users/MartinHoldrege/gee_apps:src/general_functions.js");

// this is where the data wrangling occurs
// contains one main function

var lyrMod = require("users/MartinHoldrege/SEI:scripts/05_lyrs_for_apps.js");
var d = lyrMod.main({
  root: root
}); // returns a dictionary



// fig params --------------------------------------------------------------

var sldRampDiff1 = fig.sldRampDiff1;
// setup app environment 

ui.root.clear();
//var panel = ui.Panel({style: {width: '250px'}});
var map = ui.Map();
//ui.root.add(panel).add(map); // order that you add panl vs map affects if panel is right or left
ui.root.add(map); 

map.style().set('cursor', 'crosshair');

// prepare climate data -----------------------------------------------------


// map background ------------------------------------------

map.centerObject(SEI.cur.select('Q5sc3'), 6);
map.addLayer(ee.Image(1), {'min':1, 'max':1, palette: "white"},'white background', false); 
map.addLayer(ee.Image(1), {'min':1, 'max':1, palette: "gray"},'gray background', false); 

// contributions by each Q compontent to changes --------------------------------------

var qBands = ['Q1raw', 'Q2raw', 'Q3raw'];

// creating RGB maps
// R = sage, G = perennials, B = annuals

var rgbViz = {
  bands: qBands,
  min: 0,
  max: 1
};

var rgbLab = ' (R = Q1 [sage], G = Q2 [perennials], B = Q3 [annuals])';

var diffRedImg2 = ee.Image(d.get('diffRed2Img'));
var forRgb = ee.Image(d.get('qPropMed2'))
  // areas with < 0.01 delta sei are shown as grey
  .where(diffRedImg2.select('Q5s_median').abs().lt(0.01), 211/255);
map.addLayer(forRgb, rgbViz, 'RGB' + rgbLab, false);

// Delta (fut-historical) values (min, max, median, etc) ----------------------------------

// bands of interest and their descriptions
var diffBands = ['Q1raw', 'Q2raw', 'Q3raw', 'Q5s'];
var namesBands = ['Q1 (sage)', 'Q2 (perennials)', 'Q3 (annuals)', 'SEI'];


// type 1 summaries are are values that correspond to the summary of SEI. e.g. the 'median' Q1 would be the Q1 that corresponds to the median SEI
// while type 2 is the regular median (e.g. actually the median Q1 which need not correspond to the median SEI)
for (var j = 0; j < diffBands.length; j++) {
  var band = diffBands[j];

  map.addLayer(diffRedImg2.select(band + '_median').sldStyle(sldRampDiff1), {}, 'delta ' + namesBands[j], false);

}

// agreement among GCMs -------------------------------------------------------------

// lyr used for figure 2 in manuscript ('default' simulation settings)
var numGcm = ee.Image('projects/usgs-gee-drylandecohydrology/assets/SEI/products/vsw4-3-4_gcmAgreement_RCP45_2070-2100');

map.addLayer(numGcm, fig.visNumGcm, 'Agreement among GCMs', false);

// c3 ------------------------------------------------------------------------------

map.addLayer(SEI.cur.select('Q5sc3'), fig.visc3, '3 class SEI (Doherty 2022)', false);

// c9 maps ----------------------------------------------------------------------

map.addLayer(ee.Image(d.get('p')).select('p6_c9Med'), fig.visc9, '9 class transition', true);

// 'backgroud' layers ---------------------------------------------------------------------------
map.addLayer(fig.statesOutline, {}, 'state outlines', false); // outline of states (white background)

// description panel -------------------------------------------------------------------------------------

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
var title = ui.Label('Sagebrush Ecological Integrity Projections', 
  {fontSize: '18px', fontWeight: 'bold', color: '4A997E'});

// Create a panel to hold text
var panel = ui.Panel({
  widgets:[title],//Adds header and text
  style:{width: '300px',position:'middle-left'}});


// text for the main panel

// first paragraph
var par1 = 'This app visualizes potential future changes in sagebrush ecological' + 
' integrity (SEI) under a range of scenarios using an individual plant-based' + 
' simulation model, integrated with remotely sensed estimates of current SEI.' + 
' The simulation model (STEPWAT2) allowed us to estimate how climate change,' + 
' wildfire, and invasive annuals interact to alter the potential abundance of key' + 
' plant functional types that influence sagebrush ecological integrity: sagebrush,' + 
' perennial forbs and grasses, and annual forbs grasses. Here we provide' + 
' visualizations of projected changes in SEI and SEI class (Core Sagebrush Areas,' + 
' Growth Opportunity Areas, and Other Rangeland Areas). Additionally, we show' + 
' projections of changes of three of the components of sagebrush ecological' + 
' integrity, which are the Q (‘quality’) scores for sagebrush, perennial forbs' + 
' and grasses, and annual forbs and grasses. ';

// 2nd paragraph
var par2a =    ui.Label({
    value: 'Data shown are available from ScienceBase',
    style: styleTextNoTB, // no bottom margin
  });

var par2b =    ui.Label({
    value: '(https://doi.org/10.5066/P13RXYZJ).',
    targetUrl: 'https://doi.org/10.5066/P13RXYZJ',
    style: styleUrl
  });

var par3a = ui.Label({
    value: 'Further details about the research that developed these projections' + 
    ' are available in Holdrege et al. (2024)',
    style: f.updateDict(styleText, 'margin', marginNoB), // no bottom margin
  });


var remLink = ui.Label({
    value: '(https://doi.org/10.1016/j.rama.2024.08.003).',
    targetUrl: 'https://doi.org/10.1016/j.rama.2024.08.003',
    style: f.updateDict(styleUrl, 'margin', marginNoT)
  });

// how to use
var howTo = 'Select layer(s) to view from the dropdown "Layers" menu.';

// abbrevations --------------------------
var abbrevExplain = ui.Label({
    value: 'Abbreviations:',
    style: f.updateDict(styleText, 'margin', marginNoT), // 
  });

// bullets describing the abbreviation
var bullets1Text = [
  'SEI=Sagebrush Ecological Integrity',
  'CSA=Core Sagebrush Area (an area with high SEI)',
  'GOA=Growth Opportunity Area (an area with intermediate SEI)',
  'ORA=Other Rangeland Area (an area with low SEI)'
  ];
  
var bullets1Text = [
  'SEI: Sagebrush Ecological Integrity',
  'CSA: Core Sagebrush Area (an area with high SEI)',
  'GOA: Growth Opportunity Area (an area with intermediate SEI)',
  'ORA: Other Rangeland Area (an area with low SEI)',
  'GCM: Global Climate Model',
  'RCP: Representative Concentration Pathway'
  ];
  
var layersExplain = ui.Label({
    value: 'Description of layers:',
    style: f.updateDict(styleText, 'margin', marginNoB) 
  });
  
// continue here: 
var bullets1Text = [
  '9 class transition:  Median change in sagebrush ecological integrity (SEI)' + 
  ' classification from current (2017-2021) to future (RCP 4.5, 2071-2100) climate conditions',
  '3 Class SEI: Extent of CSA, GOAs and ORAs during 2017-2020 (layer from Doherty et al. 2022)'
  ' Agreement among GCMs: Agreement among climate models for change in SEI classification (under RCP4.5, 2071-2100)' + 
  ' for areas that are currently CSAs or GOAs.' + 
  ' ‘Non-robust agreement’ indicates agreement among 7-11 models out of 13 (light colors,' + 
  ' not a robust signal), and ‘robust agreement’ means agreement among 12-13 models' + 
  ' (dark colors, a robust signal). Loss of CSA means future classification is GOA or ORA.' + 
  ' Loss of GOA means future classification is ORA.,
  'GOA: Growth Opportunity Area (an area with intermediate SEI)',
  'ORA: Other Rangeland Area (an area with low SEI)'
  ];
  
var bulletsLabel = bulletsText.map(function(x) {
  return ui.Label({
    value: '• ' + x,
    style: {fontSize: fontSizeText, margin: '0px' + mr + ' 0px 20px'},
  });
});

var bulletsPanel = ui.Panel({
  widgets: [abbrevExplain].concat(bulletsLabel).concat([abbrevExample]),
  layout: ui.Panel.Layout.Flow('vertical')
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
  par2a, par2b,
  par3a, par3b, chambersLink,
  ui.Label({
    value:'How to Use',
    style: styleHeader,
  }),
  ui.Label({
    value: howTo,
    style: styleText
  }),
  bulletsPanel,
  ui.Label({
    value:'Disclaimer',
    style: styleHeader,
  }),
  ui.Label({
    value: 'Although the underlying data and article have been reviewed and published,' + 
    ' this app is not official and comes with no warranty.',
    style: styleText
  }),
  ui.Label({
    value: 'App created by Martin Holdrege',
    style: {fontSize: '10px', margin: margin}
  }),
]);

//Add this new panel to the larger panel we created 
panel.add(description);

// Add our main panel to the root of our GUI
ui.root.insert(1,panel);

// panel  for c9 legend
map.add(fig.legendc9).add(fig.legendNumGcm);

// color bar legends --------------------

var panel2 = ui.Panel({
  style: {
    position: 'top-left',
    padding: '2px 2px'
  }
});

var panel3= fig.makeSldRampLegend(panel2, sldRampDiff1, -1, 1, 'Delta SEI and Q');
map.add(panel3)