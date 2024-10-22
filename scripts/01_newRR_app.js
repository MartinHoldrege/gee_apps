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


// text for the main panel

// first paragraph
var par1 = 'This app visualizes where climate change alters the distribution of resistance to' +
' cheatgrass invasion and ecological resilience (R&R) indicators in the sagebrush region' +
' using algorithms based on ecologically relevant and climate-sensitive predictors of' +
' climate and ecological drought. Overall, these results suggest widespread future' +
' declines in R&R which highlight a growing challenge for natural resource managers' +
' in the region. The spatially explicit datasets provide information that could be used' +
' for long-term risk assessments, prioritizations, and climate adaptation efforts.';

// 2nd paragraph
var par2a =    ui.Label({
    value: 'Data shown are available from ScienceBase',
    style: styleTextNoTB, // no bottom margin
  });

var par2b =    ui.Label({
    value: '(https://doi.org/10.5066/P928Y2GF).',
    targetUrl: 'https://doi.org/10.5066/P928Y2GF',
    style: styleUrl
  });

var par3a = ui.Label({
    value: 'Further details about the research that developed these projections' + 
    ' are available in Schlaepfer et al. (in press) Declining ecological' + 
    ' resilience and invasion resistance under climate change in the sagebrush' + 
    ' region, United States. Ecological Applications (link TBD).',
    style: f.updateDict(styleText, 'margin', marginNoB), // no bottom margin
  });

var par3b = ui.Label({
    value: 'The R&R algorithms are described in Chambers et al. 2023' ,
    style: f.updateDict(styleText, 'margin', marginNoB), // no bottom margin
  });
  
var chambersLink = ui.Label({
    value: '(https://doi.org/10.3389/fevo.2022.1009268).',
    targetUrl: 'https://doi.org/10.3389/fevo.2022.1009268',
    style: f.updateDict(styleUrl, 'margin', marginNoT)
  });

// how to use
var howTo = 'Select layer(s) to view from the dropdown "Layers" menu.' + 
' Note, by default the mask layer is selected so that only areas with' + 
' sagebrush rangelands and open woodlands are shown, and other areas are covered.';

// abbrevations --------------------------
var abbrevExplain = ui.Label({
    value: 'The components of the layer name describe what the layer represents:',
    style: f.updateDict(styleText, 'margin', marginNoT), // 
  });

// bullets describing the abbreviation
var bulletsText = [
  'Ecological resilience (resil) or invasion resistance (resist)',
  'Continuous (cont) or categorical (cats) R&R indicator',
  'Time period (e.g., calendar years 1980-2020)',
  'Ambient climate (ambient) or future projected climate based on two representative concentration pathways (RCP4.5, RCP8.5)',
  'If present in the name, "Delta" indicates the layer shows the difference between projected future' +
  ' R&R and historical reference (i.e., 1980-2020 ambient conditions)'
  ];
  
var abbrevExample = ui.Label({
    value: 'For example, the "Resil-cats_2064-2099-RCP45" layer represents projections' +
    ' of resilience, as a categorical variable, for the 2064-2099 time-period under the RCP4.5 emissions scenario.',
    style: styleText 
  });
  
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
    value: 'Although the data and article have been reviewed and published,' + 
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
