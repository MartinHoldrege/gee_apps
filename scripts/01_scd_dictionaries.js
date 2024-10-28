/*
  Purpose: Create a dictionary of image (layers) to be used for the
  app showing SCD layers (from Holdrege et al. 2024, Rangeland Ecology and Mgmt),
  also various other helper dictionaries

  Author: Martin Holdrege
  
  Started: October 28, 2024
*/

// parameters ---------------------------------------------------------------------


// dependencies --------------------------------------------------------------------

var SEI = require("users/MartinHoldrege/SEI:src/SEIModule.js");
// where the data layers  from the data_publication live
// these are the exact same layers as on science base
var pathPub = SEI.path + 'data_publication2/' 

// this is where the data wrangling occurs
// contains one main function
// note--using this for layers where we don't have an asset
// of the layer alread, (this creates some layers on the fly,
// so will render more slowly)
var lyrsF = require("users/MartinHoldrege/SEI:scripts/05_lyrs_for_apps.js").main;

// helper dictionaries -----------------------------------------------------------
// for various 'lookup' tasks

// names of the different types of runs
var runD = {
  'Default': 'fire1_eind1_c4grass1_co20_2311_',
  'CO2Fert': 'fire1_eind1_c4grass1_co21_2311_',
  'NoC4Exp': 'fire1_eind1_c4grass0_co20_2311_',
  'NoFire' : 'fire0_eind1_c4grass1_co20_2311_'
};

var scenarioD = {
  'RCP4.5 (2031-2060)': 'RCP45_2031-2060',
  'RCP4.5 (2071-2100)': 'RCP45_2071-2100',
  'RCP8.5 (2031-2060)': 'RCP85_2031-2060',
  'RCP8.5 (2071-2100)': 'RCP85_2071-2100'
};

var varsD = {
  'Change in SEI Class': 'c9',
  'Change in SEI': 'SEI',
  'Change in Q1 (Sagebrush; %)': 'Q1',
  'Change in Q2 (Perennials; %)': 'Q2',
  'Change in Q1 (Annuals; %)': 'Q3',
  'Drivers of SEI Change (R = sage, G = perennials, B = annuals)': 'rgb',
  'Agreement among GCMs': 'NumGCMGood'
};

var dict = {}; // master dictionary

// add numGCM good to dictionary -----------------------------------------------------
var numGcm = ee.Image('projects/usgs-gee-drylandecohydrology/assets/SEI/products/vsw4-3-4_gcmAgreement_RCP45_2070-2100');
print(numGcm)


