/*
Purpose: Create a visualization of the main data layers in the new RR dataset (Schlaepfer et al.)

Author: Martin Holdrege

Started: October 14, 2024
*/

// dependencies -----------------------------------------------------------------------------


// params ---------------------------------------------------------------------------------

var path = 'projects/ee-martinholdrege/assets/misc/newRR3/'

// read in layers ---------------------------------------------------------------------------

// for testing
var imagetype1 = ee.Image(path + 'Resil-cats_2029-2064-RCP45');
var imagetype2 = ee.Image(path + 'Resil-cont_2029-2064-RCP45');
var imagetype3 = ee.Image(path + 'Resil-cont_2029-2064-RCP45-delta');

// fig params --------------------------------------------------------------

ui.root.clear();
//var panel = ui.Panel({style: {width: '250px'}});
var map = ui.Map();
//ui.root.add(panel).add(map); // order that you add panl vs map affects if panel is right or left
ui.root.add(map); 

map.style().set('cursor', 'crosshair');

// legends -----------------------------------------------------------------------------




