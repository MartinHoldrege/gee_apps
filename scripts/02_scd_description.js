
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
var howTo = "Use the 'Select Variable' drop down menu to select the" + 
" R&R variable to display on the map," + 
" and use the 'Select Climate Scenario' dropdown menu to select the time-period and climate scenario.";

// abbrevations --------------------------
var abbrevExplain = ui.Label({
    value: 'Descriptions of variables and climate scenarios:',
    style: f.updateDict(styleText, 'margin', marginNoT), // 
  });

// bullets describing the abbreviation
var bulletsText = [
  'Ecological resilience (resilience) or invasion resistance (resistance) can be displayed' +
  ' as categorical (4 categories) or continuous variables.',
  "'Change' layers show the difference between projected future resistance or resilience and a" +
  " historical reference." +
  "These change layers are a continuous variable.",
  'Climate scenarios include ambient climate (ambient) or future projected climate based on two representative concentration pathways (RCP4.5, RCP8.5).'
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

ui.root.insert(0,panel.add(description));
