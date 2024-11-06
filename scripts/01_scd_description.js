/*
  Purpose: provide the description text for the SCD app

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
var title = ui.Label('Sagebrush Ecological Integrity Projections', {fontSize: '18px', fontWeight: 'bold', color: '4A997E'});

// Create a panel to hold text
var panel = ui.Panel({
  widgets:[title],//Adds header and text
  style:{width: '250px',position:'middle-left'}});


// text for the main panel

// first paragraph
var par1 = 'This app visualizes current and projected future sagebrush ecological integrity (SEI).' + 
' Projections of SEI are based on combining remotely sensed products (used for estimating current SEI)' + 
' and results from a simulation model (STEPWAT2). The simulation model allowed us to estimate how' + 
' climate change, wildfire, and invasive annuals interact to alter the potential abundance of key' + 
' plant functional types that influence sagebrush ecological integrity: sagebrush, perennial grasses,' + 
' and annual grasses. These results provide a long-term perspective on the vulnerability of sagebrush' + 
' ecosystems to climate change and may inform geographic prioritization of conservation and restoration investments.';

// 2nd paragraph
var par2a =    ui.Label({
    value: 'Data underlying these visualizations are available from ScienceBase',
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
  
var par4a = ui.Label({
    value: 'More information about the broader Sagebrush Conservation Design effort can be found at: ',
    style: f.updateDict(styleText, 'margin', marginNoB), // no bottom margin
  });

var sageLink = ui.Label({
    value: 'sagebrushconservation.org.',
    targetUrl: 'https://sagebrushconservation.org/',
    style: f.updateDict(styleUrl, 'margin', marginNoT)
  });
  


// how to use
var howTo = "Separate layers can be selected on both sides of the slider to allow for comparison."  +
" Use the 'Select Variable' drop-down menu to select the" + 
"   variable type to display on the map," + 
"  use the 'Select Climate Scenario' drop-down menu to select the time-period and climate scenario." +
"  Use the 'Select Modeling Assumption' drop-down to select one of four modeling assumptions made in the"  +
" simulations (this is for users interested in understanding the impacts of some of our decisions," + 
' see Holdrege et al. (2024) for more details). The lower drop-down menu lets you select layers showing' +
' SEI, and related inputs for historical (2017-2020) conditions (see Doherty et al. 2022).';

// abbrevations --------------------------
var abbrevExplain = ui.Label({
    value: 'Descriptions of variables and climate scenarios:',
    style: f.updateDict(styleText, 'margin', marginNoT), // 
  });

// bullets describing the abbreviation
var bulletsText = [
  'Sagebrush ecological integrity (SEI), a continuous variable (range 0-1),' + 
  ' is broken into three classes: Core Sagebrush Areas (CSA, high SEI),' + 
  ' Growth Opportunity Areas (GOA, intermediate SEI),' + 
  ' and Other Rangeland Areas (ORA, low SEI).' ,
  "In the 'Agreement among GCMs' layer 'Robust agreement' among global climate models (GCMs) means >90% of" + 
  " results from different climate models agreed on the change in SEI" + 
  " class, while 'non-robust' agreement means that <90% of the results agreed.",
  "The 'Drivers of Change in SEI' layer shows whether changes in the abundance of sagebrush (red), perennials" + 
  " (green) or annuals (blue) were responsible for the projected change in SEI in a given pixel." + 
  " Note that intermediate colors are also possible, and mean that there were multiple drivers" + 
  " (e.g., purple means that both sagebrush and annuals caused the projected change).",
  " Q values are the 'quality' scores (range 0-1) that are used in the calculation of SEI.",
  'Climate scenarios include future projected climate based on two representative concentration' + 
  ' pathways (RCP4.5, RCP8.5) and two time-periods (2031-2060, 2071-2100).'
  ];
  

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
  par3a, remLink, par4a, sageLink,
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

exports.panel = panel.add(description);

// testing
//ui.root.insert(0,panel.add(description));
