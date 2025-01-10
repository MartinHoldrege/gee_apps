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
var par1 = 'first Paragraph, include abstract type text here';

// 2nd paragraph
var par2a =    ui.Label({
    value: 'Data underlying these visualizations are available from ScienceBase',
    style: styleTextNoTB, // no bottom margin
  });

var par2b =    ui.Label({
    value: '(URL).',
    targetUrl: 'URL',
    style: styleUrl
  });

var par3a = ui.Label({
    value: 'Further details about the research that developed these projections' + 
    ' are available citation',
    style: f.updateDict(styleText, 'margin', marginNoB), // no bottom margin
  });

var remLink = ui.Label({
    value: '(doi here).',
    targetUrl: 'doi here',
    style: f.updateDict(styleUrl, 'margin', marginNoT)
  });
  



// how to use
var howTo = "Separate layers can be selected on both sides of the slider to allow for comparison."  +
" Use the 'Select Species' blah blah";

// abbrevations --------------------------
var abbrevExplain = ui.Label({
    value: 'Descriptions of variables and climate scenarios:',
    style: f.updateDict(styleText, 'margin', marginNoT), // 
  });

// bullets describing the abbreviation
var bulletsText = [
  ' Further details here...' ,
  'and more details'
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
  par3a, remLink, 
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
ui.root.insert(0,panel);

