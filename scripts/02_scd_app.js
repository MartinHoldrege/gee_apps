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
 

// dependencies -----------------------------------------------------------

// Load module with functions 
// The functions, lists, etc are used by calling SEI.nameOfObjectOrFunction
var SEI = require("users/MartinHoldrege/SEI:src/SEIModule.js");
var figP = require("users/MartinHoldrege/SEI:src/fig_params.js");
var f = require("users/MartinHoldrege/gee_apps:src/general_functions.js");
var load = require("users/MartinHoldrege/gee_apps:scripts/01_scd_load-layers.js");

// setup app environment --------------------------------------------------

ui.root.clear();

var map = ui.Map();

ui.root.add(map); 

map.style().set('cursor', 'crosshair');

// prepare climate data -----------------------------------------------------


// map background ------------------------------------------

// map.centerObject(SEI.cur.select('Q5sc3'), 6); // update as needed

// contributions by each Q compontent to changes --------------------------------------

