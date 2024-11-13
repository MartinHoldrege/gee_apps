/*
Purpose: Create a visualization of the main data layers in the new RR dataset (Schlaepfer et al.)

Author: Martin Holdrege

Started: October 14, 2024
*/


// dependencies -----------------------------------------------------------------------------

var figP = require("users/MartinHoldrege/gee_apps:src/fig_params.js");
var f = require("users/MartinHoldrege/gee_apps:src/general_functions.js");
var figF = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");
var figPScd = require("users/MartinHoldrege/SEI:src/fig_params.js");

// params ---------------------------------------------------------------------------------

var path = 'projects/ee-martinholdrege/assets/misc/newRR3/'; // where images are read in from
var indexBackground = 0;
var indexRr = 1; 
var indexStates = 2;

// visualization params
var visT1 = figP.visT1; // type 1
var visT2 = figP.visT2; // type 2
var visT3 = figP.visT3; // type 3


var testRun = false; // fewer images displayed for test run
// read in layers ---------------------------------------------------------------------------

// the mask ingested with a 'sample' pyramid scheme 
var mask = ee.Image(path + 'negMask_samplePyramid')
  .unmask().eq(0);
  

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

if (testRun) {
  var imageNamesL = imageNamesL.slice(imageNamesL.length - 4, imageNamesL.length - 1);
}

// setup ---------------------------------------------------

ui.root.clear();
//var panel = ui.Panel({style: {width: '250px'}});
//ui.root.add(panel).add(map); // order that you add panl vs map affects if panel is right or left


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

// create dictionaries ---------------------------------------------

// dictionary of the images
var imagesD = imageNamesL.reduce(function(acc, key) {
  acc[key] = ee.Image(path + key);
  return acc;
}, {});


// components of the image names that correspond to the types of variables
// note--be careful with these hand written dictionaries if the key/value 
// pairs aren't correct the wrong layer will be shown! the key's 
// are the names that will be shown in the drop-down menus
var varTypesD = {
  'Resilience (categorical)': ['Resil-cats', ''],
  'Resilience (continuous)': ['Resil-cont', ''],
  'Resistance (categorical)': ['Resil-cats', ''],
  'Resistance (continuous)': ['Resil-cont', ''],
  'Change in Resilience (continuous)': ['Resil-cont', '-delta'],
  'Change in Resistance (continuous)': ['Resist-cont', '-delta']
};

// components of the image names that correspond to the climate scenario
var scenarioD = {
  'Ambient (1980-2020)': '1980-2020-Ambient',
  'RCP4.5 (2029-2064)': '2029-2064-RCP45',
  'RCP4.5 (2064-2099)': '2064-2099-RCP45',
  'RCP8.5 (2029-2064)': '2029-2064-RCP85',
  'RCP8.5 (2064-2099)': '2064-2099-RCP85'
};

var ambient = 'Ambient (1980-2020)';

// some variable types can't take on all of the scenarios
// (i.e. there is no delta layer for ambient conditions)
var availableScenariosD = {
  'Change in Resilience (continuous)': Object.keys(f.removeKeys(scenarioD, [ambient])),
  'Change in Resistance (continuous)': Object.keys(f.removeKeys(scenarioD, [ambient]))
};

// dictionary of the visualization parameters
var visParamsD = {
  'Resilience (categorical)': visT2,
  'Resilience (continuous)': visT1,
  'Resistance (categorical)': visT2,
  'Resistance (continuous)': visT1,
  'Change in Resilience (continuous)': visT3,
  'Change in Resistance (continuous)': visT3
};

// Variables to store current selections
// using a dictionary that can be updated in child
// environments (so don't have scoping issues)
var selections = {
    varTypeLeft: 'Resilience (categorical)',
    scenarioLeft: 'Ambient (1980-2020)',
    varTypeRight: 'Resilience (categorical)',
    scenarioRight: 'RCP4.5 (2064-2099)',
    applyMask: true,
    showBackground:false
};

// functions ---------------------------------------------------------------------


// functions that rely on objects in the environment (therefore shouldn't be sourced from a different script)

// return the name of the RR asset based on components of the name
var createRrImageName = function(varTypeName, scenarioName) {
  var varType = varTypesD[varTypeName];
  var scenario = scenarioD[scenarioName];
  return varType[0] + '_' + scenario + varType[1];
};

// plot the image based in the variable and scenario names 
var getImage = function(varTypeName, scenarioName, applyMask) {
    // form the image name
    var imageName = createRrImageName(varTypeName, scenarioName); 
    
    if(!(imageName in imagesD)) {
      // creating a transparent layer
      return ui.Map.Layer(ee.Image(0).selfMask(), {}, 'this layer does not exist');
    }
    
    var image = imagesD[imageName];// return the image from dictionary
    var vis = visParamsD[varTypeName]; // return the vis params
    
    if(applyMask) {
      var image = image.updateMask(mask);
    }
    return ui.Map.Layer(image, vis, imageName);
};

// This function changes the map to show the selected image.
var updateMap = function(mapToChange, side) {
  var scenario = selections['scenario' + side];
  var varType = selections['varType' + side];
  mapToChange.layers().set(indexRr, getImage(varType, scenario, selections.applyMask));
};

// create checkbox for applying the mask
var createMaskCheckbox = function(leftMap, rightMap) {
  var out = ui.Checkbox({
    label: 'Mask areas that are not sagebrush rangelands or open woodlands',
    value: true,  // Initially checked
    onChange: function(checked) {
        selections.applyMask = checked;
        updateMap(leftMap, 'Left');  // Update the map when the checkbox is toggled
        updateMap(rightMap, 'Right');
    },
    style: styleCheckbox
  });
  return out;
};


// Checkbox for toggling the visibility of the background and states outline
var createBackgroundCheckbox = function(mapToChange1, mapToChange2) {
    return ui.Checkbox({
        label: 'Add plain background and state outlines',
        value: false,  // Initially unchecked
        onChange: function(checked) {
          // making plain background and states visible or not
          // in both the left and right maps
          figF.changeLayerVisibility(mapToChange1, indexBackground, checked)
          figF.changeLayerVisibility(mapToChange2, indexBackground, checked)
          figF.changeLayerVisibility(mapToChange1, indexStates, checked)
          figF.changeLayerVisibility(mapToChange2, indexStates, checked)
        },
        style: styleCheckbox
    });
};

  // Configure a selection dropdown to allow the user to choose
  // between variable types and climate scenarios, and set the map to update.
function addLayerSelectors(mapToChange, side, position) {
    var labelVar = ui.Label('Select Variable:');
    var labelScenario = ui.Label('Select Climate Scenario:');

    // Configure a selection dropdown to allow the user to choose
    // between images, and set the map to update when a user 
    // makes a selection.
    
    // Selector for variable type
    var selectVar = ui.Select({
      items: Object.keys(varTypesD),
      onChange: function(newVarSelection) {
        selections['varType' + side] = newVarSelection;  // Update the variable selection

        // Update the available scenarios based on the selected variable
        var availableScenarios = availableScenariosD[selections['varType' + side]] || Object.keys(scenarioD);

        // variable drop down
        
        // Reset to the first available scenario or the default one if available (this is an ifelse statement)
        var defaultScenarioForVar = f.listIncludes(availableScenarios, selections['scenario' + side])
          ? selections['scenario' + side] // if true
          : availableScenarios[0]; // if false
        // selectScenario.setValue(defaultScenarioForVar, true);
        selections['scenario' + side] = defaultScenarioForVar;
        selectScenario.setValue(defaultScenarioForVar, true);  // Explicitly set the selected value in the dropdown
        // Update the map with the new selection
        updateMap(mapToChange, side);
      }
    });
    
    // scenario drop-dwond
    var selectScenario = ui.Select({
        items: Object.keys(scenarioD),
        onChange: function(newScenarioSelection) {
            selections['scenario' + side] = newScenarioSelection;  // Update the scenario selection
            updateMap(mapToChange, side);  // Update the map with the current variable and scenario
        }
    });
    
    selectVar.setValue(selections['varType' + side], true);
    selectScenario.setValue(selections['scenario' + side], true);
    
    var controlPanel =
        ui.Panel({
            widgets: [labelVar, selectVar, labelScenario, selectScenario, 
                      createMaskCheckbox(mapToChange),
                      createBackgroundCheckbox()],
            style: {
                position: 'top-left'
            }
        });
    
    var controlPanel =
      ui.Panel({
          widgets: [labelVar, selectVar, labelScenario, selectScenario],
          style: {
              position: 
              position,
              padding: '2px',
              margin: '2px'
          }
    });
        
    mapToChange.add(controlPanel);
}

// end functions --------------------------------------------------------------------

/*
  Add selectors and layers
*/

// setup the two maps ----------------------------------------------------

// Create the left map, and have it display the first layer.
var leftMap = ui.Map();
leftMap.setControlVisibility(true);
// map.centerObject(SEI.cur.select('Q5sc3'), 6); // update as needed

// Create the right map, and have it display the last layer.
var rightMap = ui.Map();
rightMap.setControlVisibility(true);

leftMap.centerObject(mask, 6);

// add selectors to the maps
addLayerSelectors(leftMap, 'Left', 'top-left');
addLayerSelectors(rightMap, 'Right', 'top-right');

// checkboxes (added to panel below)
var maskCheckbox = createMaskCheckbox(leftMap, rightMap); 
var backgroundCheckbox = createBackgroundCheckbox(leftMap, rightMap);

// create the split panel -----------------------------------------------

// Create a SplitPanel to hold the adjacent, linked maps.
var splitPanel = ui.SplitPanel({
    firstPanel: ui.Panel({
      widgets: [leftMap],
      style: {width: '35%', height: '100%'}  // changing the width percent so slider is more centered
    }),
    secondPanel: rightMap,
    wipe: true,
    style: {
        stretch: 'both'
    }
});

// Adjust the size of the first (left) panel
// Set the SplitPanel as the only thing in the UI root.
ui.root.widgets().reset([splitPanel]);
var linker = ui.Map.Linker([leftMap, rightMap]);

// add the main layer and selectors


// Add the background layer
var createBackground = function() {
  var background = ee.Image(0).visualize({palette: ['lightgray']}); 
  return ui.Map.Layer(background, {}, 'Background', false, 1.0);
};

leftMap.layers().set(indexBackground, figF.createBackgroundLayer('lightgray')); 
rightMap.layers().set(indexBackground, figF.createBackgroundLayer('lightgray')); 

// Add the states outline layer 

leftMap.layers().set(indexStates, figF.createStatesLayer()); // 2 index, so on top of ther layers
rightMap.layers().set(indexStates, figF.createStatesLayer()); // 2 index, so on top of ther layers


///////////////////////////////////////////////////////////////
//      Set up panels and for Description            //
///////////////////////////////////////////////////////////////



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
var howTo = "Different layers can be selected on either side of the slider to allow for comparison." + 
"Use the 'Select Variable' drop down menu to select the" + 
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
ui.root.insert(0,panel);

// add legends  -------------------------------

var secondPanel = ui.Panel({widgets: [maskCheckbox, backgroundCheckbox]});
ui.root.insert(1, secondPanel.add(figP.legendsRr));


