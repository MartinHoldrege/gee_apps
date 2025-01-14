/*
  Purpose: provide the description text for the PJ app

*/
// dependencies -----------------------------------------------------------------------------

var f = require("users/MartinHoldrege/gee_apps:src/general_functions.js");

///////////////////////////////////////////////////////////////
//      Set up panels and for Description            //
///////////////////////////////////////////////////////////////

// styles ---------------------------------------------------------

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
var styleCheckbox = {fontSize: '12px', width: '150px'};

var styleUrl = {
  fontSize: fontSizeText, 
  color: 'blue', 
  textDecoration: 'underline',
  margin: marginNoTB
};


// Set up title and summary widgets

//App title
var title = ui.Label('Projections of Pinyon-Juniper Species Distributions', {fontSize: '18px', fontWeight: 'bold', color: '4A997E'});

// Create a panel to hold text
var panel = ui.Panel({
  widgets:[title],//Adds header and text
  style:{width: '250px',position:'middle-left'}});


// text for the main panel

// first paragraph
var par1 = 'This app visualizes current and projected future suitability for pinyon and' + 
' juniper tree species of the western US. Projections of suitability are constructed using' + 
' gridded climate and soil covariates (1 km grid cell size), combined in species distribution' + 
' models. The models allow us to estimate how environmental suitability for PJ species is' + 
' expected to change from current to future conditions, and assess agreement on projected' + 
' suitability change across many climate scenarios. These suitability projections provide' + 
' a long-term perspective on the vulnerability of PJ woodlands to climate change and may' + 
' inform conservation efforts in PJ woodlands.';

// 2nd paragraph
var par2a =    ui.Label({
    value: 'Data underlying these visualizations are available from ScienceBase',
    style: styleTextNoTB, // no bottom margin
  });

var par2b =    ui.Label({
    value: '(https://doi.org/10.5066/P13BZMAT).',
    targetUrl: 'https://doi.org/10.5066/P13BZMAT',
    style: styleUrl
  });

var par3a = ui.Label({
    value: 'Further details about the research that developed these projections' + 
    ' are available in Noel et al. (2025)',
    style: f.updateDict(styleText, 'margin', marginNoB), // no bottom margin
  });

var remLink = ui.Label({
    value: '(https://doi.org/10.1016/j.rama.2024.09.002).',
    targetUrl: 'https://doi.org/10.1016/j.rama.2024.09.002',
    style: f.updateDict(styleUrl, 'margin', marginNoT)
  });
  
var par4 = ui.Label({
    value: 'For more research on climate adaptation in dryland ecosystems, visit',
    style: f.updateDict(styleText, 'margin', marginNoTB), // no bottom margin
  });
  
var detLink = ui.Label({
    value: 'drylandecology.org.',
    targetUrl: 'https://sites.google.com/view/dryland-ecohydrology-team/home',
    style: f.updateDict(styleUrl, 'margin', marginNoT)
  });


// how to use
var howTo = "Separate layers can be selected on both sides of the slider to allow" + 
" for comparison. Use the 'Select Species' drop-down menu to select the species" + 
" to display on the map, use the 'Select Variable' drop-down menu to select the" + 
" variable of interest, and use the 'Select Climate Scenario' drop-down menu to display" + 
" results for a given emissions scenario and time-period combination.";

// abbrevations --------------------------
var abbrevExplain = ui.Label({
    value: 'Descriptions of variables and climate scenarios:',
    style: f.updateDict(styleText, 'margin', marginNoT), // 
  });

// bullets describing the abbreviation
var bulletsText = [
 "'Suitability' is a continuous variable (0 to 1) estimating environmental suitability" + 
" for a given species and climate scenario, where a value of 1 indicates maximum suitability.",
 "'Change in suitability' is a continuous variable (-1 to 1) estimating the change in" + 
" suitability for a given species from current to future climate scenario conditions.",
 "'Change in suitability category' is a categorical variable that assess the agreement" + 
 " among our projections of suitability change (robust agreement is when >90% of model" + 
 " projections agree). The 'category' is calculated by assessing whether species' suitability" + 
 " values are above or below a model-defined suitability threshold, and whether the suitability" + 
 " value crosses that threshold under future climate conditions. For example, the dark red color" + 
 " ('Robust decrease to below threshold') indicates that suitability under current conditions" + 
 " is above threshold and >90% of our models agree that suitability is projected to shift below" + 
 " the threshold in the future. For more detailed explanation, please see Noel et al. (2025)." ,
 "Future climate conditions are represented by SSP2-4.5 (moderate emissions), SSP3-7.0" + 
 " (moderate-high emissions), and SSP5-8.5 (high emissions) scenarios for both mid-century" + 
 " (2041-2060) and end-century (2081–2100)."
  ];
  

var lastPar = "All variable layers are displayed with a semi-transparent layer on top, indicating" + 
" locations of our occurrence data used to fit our models (20 km buffer around each occurrence point)." + 
" Areas of 100% transparency indicate the species is currently present. Areas of 50% transparency are" + 
" more than 20 km distance from an occurrence point, but still may contain PJ occurrences that are" + 
" not contained in agency databases.";

var bulletsLabel = bulletsText.map(function(x) {
  return ui.Label({
    value: '• ' + x,
    style: {fontSize: fontSizeText, margin: '0px' + mr + ' 0px 20px'},
  });
});

var bulletsPanel = ui.Panel({
  widgets: [abbrevExplain].concat(bulletsLabel),
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
  par3a, remLink, 
  par4, detLink,
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
    value: lastPar, 
    style: styleText
  }),
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

exports.panel = panel.add(description);

// testing
// ui.root.insert(0,panel);

