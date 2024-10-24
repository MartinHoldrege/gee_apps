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
var visT1 = figp.visT1; // type 1
var visT2 = figp.visT2; // type 2
var visT3 = figp.visT3; // type 3

// default layer the app shows
var defaultVarType = 'Resilience (categorical)';
var defaultScenario = 'Ambient (1980-2020)';

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

if (testRun) {
  var imageNamesL = imageNamesL.slice(imageNamesL.length - 4, imageNamesL.length - 1);
}

// setup ---------------------------------------------------

ui.root.clear();
//var panel = ui.Panel({style: {width: '250px'}});
var map = ui.Map();
//ui.root.add(panel).add(map); // order that you add panl vs map affects if panel is right or left
ui.root.add(map); 

map.style().set('cursor', 'crosshair');
map.centerObject(mask, 6);

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

// functions ---------------------------------------------------------------------


// functions that rely on objects in the environment (therefore shouldn't be sourced from a different script)

// return the name of the RR asset based on components of the name
var createRrImageName = function(varTypeName, scenarioName) {
  var varType = varTypesD[varTypeName];
  var scenario = scenarioD[scenarioName];
  return varType[0] + '_' + scenario + varType[1];
};

// plot the image based in the variable and scenario names 
var getImage = function(varTypeName, scenarioName) {
    // form the image name
    var imageName = createRrImageName(varTypeName, scenarioName); 
    var image = imagesD[imageName];// return the image from dictionary
    var vis = visParamsD[varTypeName]; // return the vis params
    return ui.Map.Layer(image, vis, imageName);
};
getImage(defaultVarType, defaultScenario);

function addLayerSelectors(mapToChange, defaultVarType, defaultScenario) {
    var labelVar = ui.Label('Select Variable:');
    var labelScenario = ui.Label('Select Climate Scenario:');

    // Configure a selection dropdown to allow the user to choose
    // between images, and set the map to update when a user 
    // makes a selection.
    
    // Variables to store current selections
    // using a dictionary that can be updated in child
    // environments (so don't have scoping issues)
    var selections = {
        varType: defaultVarType,
        scenario: defaultScenario
    };

    // This function changes the map to show the selected image.
    var updateMap = function() {
      mapToChange.layers().set(0, getImage(selections.varType, selections.scenario));
    };

    // Configure a selection dropdown to allow the user to choose
    // between variable types and climate scenarios, and set the map to update.

    // Selector for variable type
    var selectVar = ui.Select({
      items: Object.keys(varTypesD),
      onChange: function(newVarSelection) {
          selections.varType = newVarSelection;  // Update the variable selection

          // Update the available scenarios based on the selected variable
          var availableScenarios = availableScenariosD[selections.varType] || Object.keys(scenarioD);

          // Update the items in the selectScenario dropdown
          selectScenario.items().reset(availableScenarios); // then re-fill

          // Reset to the first available scenario or the default one if available (this is an ifelse statement)
          var defaultScenarioForVar = f.listIncludes(availableScenarios, selections.scenario)
            ? selections.scenario // if true
            : availableScenarios[0]; // if false
          // selectScenario.setValue(defaultScenarioForVar, true);
          selections.scenario = defaultScenarioForVar;
          selectScenario.setValue(defaultScenarioForVar, true);  // Explicitly set the selected value in the dropdown
          // Update the map with the new selection
          updateMap();
      }
    });
    
    // Selector for scenario type
    var selectScenario = ui.Select({
        // items: availableScenariosD[defaultVarType] || Object.keys(scenarioD),
        items: Object.keys(scenarioD),
        onChange: function(newScenarioSelection) {
            selections.scenario = newScenarioSelection;  // Update the scenario selection
            updateMap();  // Update the map with the current variable and scenario
        }
    });
    
    selectVar.setValue(defaultVarType, true);
    selectScenario.setValue(defaultScenario, true);
    
    var controlPanel =
        ui.Panel({
            widgets: [labelVar, selectVar, labelScenario, selectScenario],
            style: {
                position: 'top-left'
            }
        });

    mapToChange.add(controlPanel);
}



/*
  Setup interactive selectors
  
  this code sets up the components so that users can select the
  layers of interest via drop down menus
*/

addLayerSelectors(map, defaultVarType, defaultScenario);

///////////////////////////////////////////////////////////////
//      Set up panels and for Description            //
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
//ui.root.insert(1,panel);

// add legends  -------------------------------

//map.add(figp.legendsRr);


///////////////////////////////////////////////////////////////
//      add maps                                            //
///////////////////////////////////////////////////////////////



// map.addLayer(mask, {palette: 'white'}, 'mask non-sagebrush rangelands', true);
