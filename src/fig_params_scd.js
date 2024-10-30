/*
  Purpose: functions and other elements for visualizations of future SCD app

  Author: Martin Holdrege
  
  Started: Oct 30, 2024
*/

// dependencies --------------------------------------------------------------------------

var figF = require("users/MartinHoldrege/gee_apps:src/fig_functions.js");

// color palettes, see https://github.com/gee-community/ee-palettes
var palettes = require('users/gena/packages:palettes');

// colors and visualiztion parameters----------------------------------------------------------
var grey = '#bebebe';

// number of GCMs agreeing
var colsNumGcm = ['#053061',
                 '#92c5de',
                 '#e31a1c',
                 '#800026',
                 '#252525',
                 '#bdbdbd',
                 '#ffeda0',
                 '#fd8d3c',
                 '#eee1ba'];

exports.visNumGcm = {min: 1, max: 9, palette: colsNumGcm};

var labelsNumGcm = ["Stable CSA (robust agreement)", 
                    "Stable CSA (non-robust agreement)", 
                    "Loss of CSA (non-robust agreement)", 
                    "Loss of CSA (robust agreement)", 
                    "Stable (or improved) GOA (robust agreement)", 
                    "Stable (or improved) GOA (non-robust agreement)", 
                    "Loss of GOA (non-robust agreement)", 
                    "Loss of GOA (robust agreement)", 
                    "Other rangeland area"];
// styled layer descriptor for delta SEI

// cols delta SEI
var colsDelta = ['#67001F', '#B2182B', '#D6604D', '#F4A582', '#FDDBC7', 
  grey, '#D1E5F0', '#92C5DE', '#4393C3', '#2166AC', '#053061'];
var breaksDeltaSEI = [-1, -0.2, -0.1, -0.05, -0.02, -0.01, 0.01, 0.02, 0.05, 0.1, 0.2, 1];

exports.sldDiff1 = figF.createSldColorBlocks(breaksDeltaSEI, colsDelta);

// cols for % change in Q
var breaksDeltaQ =[-100, -50, -25, -15, -10, -5, 5, 10, 15, 25, 50, 100];
exports.sldDeltaQ = figF.createSldColorBlocks(breaksDeltaQ, colsDelta);

// cols for c9 

var c9Palette =  ['#142b65', // stable core (black)
              '#b30000', //'#d7301f', # core becomes grow # reds from 9-class OrRd
             '#67001f',  // core becomes impacted
             '#757170', // grow becomes core
             '#99d4e7', // stable grow
             '#fc8d59',// grow becomes impacted
             '#000000', // impacted becomes core
             '#D9D9D9', // impacted becomes grow
             '#eee1ba'] // stable impacted
             
var c9Names =  [
  'Stable CSA',
  'CSA becomes GOA',
  'CSA becomes ORA',
  'GOA becomes CSA',
  'Stable GOA',
  'GOA becomes ORA',
  'ORA becomes CSA',
  'ORA becomes GOA',
  'Stable ORA'
];

exports.visC9 = {min: 1, max: 9, palette: c9Palette};


exports.visSEI = {min:0, max: 1, palette: ['#ece7f2', '#023858']}; // light to dark blue

var c3Palette = ["#142b65", "#99d4e7", "#eee1ba"];
exports.visc3 = {opacity: 1, min:1, max:3, palette: c3Palette};



// mapping visualizing elements -----------------------------------------------------------



// testing -------------------------------------
/*//print(legends)
var map = ui.Map();
ui.root.clear(); // for testing
ui.root.add(map);
map.add(legends)*/