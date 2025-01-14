/*
Description: functions for visualizations


*/

// dependencies
var figPScd = require("users/MartinHoldrege/SEI:src/fig_params.js");

// create styled layer discriptor ----------------------------------------------


// input quantity (number), and color (hex code)
var createColorMapEntry = function(quantity, color) {
  return '<ColorMapEntry color="' + color + '" quantity="' + quantity + '" label=""/>';
};

// inputs are lists of break points and colors
var createColorMapEntries = function(breaks, colors) {
  if ((breaks.length - 1) !== colors.length) {
    throw new Error("colors should have one less element than breaks");
  }
  
  var string = '';
  for (var i = 0; i < colors.length; i++) {
    var lower = createColorMapEntry(breaks[i], colors[i]);
    // want colors to be in blocks (not gradations) and the next 'block'
    // will be sligher higher (hence the small amount added) than the previous block
    var upper = createColorMapEntry(breaks[i + 1] - 0.0001, colors[i]);
    var string = string + lower + upper;
  }
  return string
}

// creates a rasterSymbolizer string for assigning colors
// to intervals, described by breaks (list of numbers),
// and their colors (list of colors)
// this is a hacky approach where the color ramp
// changes very quickly so colors look discrete
exports.createSldColorBlocks = function(breaks, colors) {
  var prefix = '<RasterSymbolizer>' +
    '<ColorMap type="ramp" extended="true" >';
  var middle = createColorMapEntries(breaks, colors);
  
  var suffix =   '</ColorMap>' + '</RasterSymbolizer>';
  
  return prefix + middle + suffix;
};


// creating legends -------------------------------------------------------------


// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: color,
          // Use padding to give the box height and width.
          padding: '6px',
          margin: '0 0 1px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {
          margin: '0 0 1px 1px',
          fontSize: '11px',
          width: '150px',
        }
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};

exports.makeRow = makeRow;


exports.makeRowLegend = function(legends, colorList, nameList, title, styleTitle) {
  
  if (styleTitle === undefined || styleTitle === null){
    var styleTitle = {
      fontWeight: 'bold',
      fontSize: '11px',
      margin: '10px 0px 4px 0px',
      padding: '0'
    };
  }
  // Drivers of Change
  legends.add(
    ui.Label({
      value: title,
      style: styleTitle
    })
  );
  
  if (colorList.length !== nameList.length) {
    throw new Error('colors and names need to be of same length');
  }
  
  for (var i = 0; i < colorList.length; i++) {
    legends.add(makeRow(colorList[i], nameList[i]));
  } 
  
  return legends;
};


// style elements for the next two functions

var styleLabel = {
      fontSize: '10px',
      margin: '0 0 0 0',
      padding: '0'
  };
  
var styleTitle = {
    fontWeight: 'bold',
    fontSize: '11px',
    margin: '10px 0px 4px 0px',
    padding: '0'
    };

/**
 * Creating color bar legend for maps that are displayed with a regular dictionary of visualization parameters
 * @param {ui.panel} existing_panel to add new panel additions to (this panel specificies the location)
 * @param {vizParams} dictionary containing min, max and palette
 * @param {string} legend title
 * @param {label1} (optional) label for left of color bar
 * @param {label2} (optional) label for right of color bar
 * @return {ui} ui object that 
 */
var makeVisParamsRampLegend = function(existing_panel, visParams, title, label1, label2,
styleLegendTitle) {
  var min = visParams.min;
  var max = visParams.max;
  
  if (label1 === undefined || label1 === null){
    var label1 = min;
  }
  
  if (label2 === undefined || label2 === null){
    var label2 = max;
  }
  
  if (styleLegendTitle === undefined || styleLegendTitle === null){
    var styleLegendTitle = styleTitle;
  }
  var lon = ee.Image.pixelLonLat().select('longitude');
  var gradient = lon.multiply((max - min)/100.0).add(min);
  var legendImage = gradient.visualize(visParams);
  var thumb = ui.Thumbnail({
    image: legendImage,
    params: {bbox:'0,0,100,8', dimensions:'128x10'},
    style: {
      position: 'bottom-center',
      padding: '0px 0px 0px 0px',
      margin: '0px 4px 0px 4px'
    } 
  });

  var panel2 = ui.Panel({
    widgets: [
      ui.Label({value: label1, style: styleLabel}),
      ui.Label({style: {stretch: 'horizontal'}}),
      ui.Label({value: label2, style: styleLabel}) 
      ],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal', maxWidth: '140px', padding: '0px 0px 0px 0px'}
  });
  
  var new_panel = existing_panel
  // adding a title
    .add(ui.Label({
      value: title,
      style: styleLegendTitle
  }))
    .add(panel2)
    .add(thumb);
  return new_panel;
};

exports.makeVisParamsRampLegend = makeVisParamsRampLegend;

// same as makeVisParamsRampLegend, but allows arguments to be passed via dictionary
exports.makeVisParamsRampLegend2 = function(args) {
  return makeVisParamsRampLegend(
    args.existing_panel, 
    args.visParams, 
    args.title, 
    args.label1, 
    args.label2,
    args.styleLegendTitle);
};
/**
 * Creating color bar legend for layers that show colors with <RasterSymbolizer>
 * @param {ui.panel} existing_panel to add new panel additions to (this panel specificies the location)
 * @param {sld} sld xml string
 * @param {number} minimum value in the sld 
 * @param {number} max value in the sld 
 * @param {string} legend title
 * @return {ui} ui object that 
 */
exports.makeSldRampLegend = function(existing_panel, sld, min, max, title) {
  var lon = ee.Image.pixelLonLat().select('longitude');
  var gradient = lon.multiply((max - min)/100.0).add(min);
  var legendImage = gradient.sldStyle(sld);
  var thumb = ui.Thumbnail({
    image: legendImage,
    params: {bbox:'0,0,100,8', dimensions:'128x10'},
    style: {
      position: 'bottom-center',
      padding: '0px 0px 0px 0px',
      margin: '0px 4px 0px 4px'
    } 
  });
  var label1 = min;
  var label2 = max;
  
  var panel2 = ui.Panel({
    widgets: [
      ui.Label({value: label1, style: styleLabel}),
      ui.Label({style: {stretch: 'horizontal'}}),
      ui.Label({value: label2, style: styleLabel}) 
      ],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal', maxWidth: '140px', padding: '0px 0px 0px 0px'}
  });
  
  var new_panel = existing_panel
  // adding a title
    .add(ui.Label({
      value: title,
      style: styleTitle}))
    .add(panel2)
    .add(thumb);
  return new_panel;
};

// working with layers ---------------------------------------------------------

function isLayerPresentAtIndex(map, index) {
  // Check if the index is within the bounds of the layers array
  if (index < map.layers().length()) {
    // If the index is valid, check if the layer at that index is not null
    return map.layers().get(index) !== null;
  } else {
    // Index is out of bounds, meaning no layer is present at this index
    return false;
  }
}

exports.isLayerPresentAtIndex = isLayerPresentAtIndex;

// remove a map layer based on it's index
exports.removeLayer = function(mapToChange, index) {
  var lay = mapToChange.layers().get(index);
  if(lay){
    mapToChange.remove(lay);
  }
};

var changeLayerVisibility = function(mapToChange, index, show) {
  var lay = mapToChange.layers().get(index);
  if(lay){
    lay.setShown(show);
  }
};
exports.changeLayerVisibility = changeLayerVisibility;

// add a layer back to a given index, at set it's visibility
// on if needed, this can be necessary if layers at set 
// indexes get removed if a lower layer gets removed and re-added
exports.addLayerBack = function(mapToChange, layer, index, show) {
  var present = isLayerPresentAtIndex(mapToChange, layer);
  
  // add layer back if it isn't present
  if(!present) {
    mapToChange.layers().set(index, layer);
  }
  // make visible if needed
  if(show) {
    changeLayerVisibility(mapToChange, index, show);
  }
};

// background layers ------------------------------------------------------------------

// layers
exports.createBackgroundLayer = function(color) {
  var background = ee.Image(0).visualize({palette: [color]});  
  return ui.Map.Layer(background, {}, 'Background', false, 1.0);
};

exports.createStatesLayer = function() {
  return ui.Map.Layer(figPScd.statesOutline, {color: 'black', lineWidth: 2}, 'State Outlines', false, 1.0);
};

// Checkbox for toggling the visibility of the background and states outline
// Checkbox for toggling the visibility of the background and states outline
// args is a dictionary with mapToChange1, mapToChange2, index1, index2
// required arguments (style is optionals)
// mapToChange represent the left and right maps in app with slider
// and the index represents the index position of background and foreground
// layers to turn of and on
// a dict (dictionary containing 'showBackground' item can also be provided)
exports.createBackgroundCheckbox2Maps = function(args) {
    var style = args['style']
    if (style === undefined || style === null){
      var style = {fontSize: '12px', width: '150px'};
    }
    return ui.Checkbox({
        label: 'Add plain background and state outlines',
        value: false,  // Initially unchecked
        onChange: function(checked) {
          // if a dictionary containing a showBackground item is provided
          // update that item to checked
          if (!(args.dict.showBackground === undefined || args.dict.showBackground === null)) {
            args.dict.showBackground = checked;
          }
          // making plain background and states visible or not
          // in both the left and right maps

          changeLayerVisibility(args.mapToChange1, args.index1, checked)
          changeLayerVisibility(args.mapToChange2, args.index1, checked)
          changeLayerVisibility(args.mapToChange1, args.index2, checked)
          changeLayerVisibility(args.mapToChange2, args.index2, checked)
        },
        style: style
    });
};


// Function to apply a mask to a given layer index
var applyMaskToLayer = function(map, layerIndex, mask) {
  // Get the current layer at the specified index
  var currentLayer = map.layers().get(layerIndex);
  
  // Check if the layer exists and is of type Image

    var eeImage = currentLayer.getEeObject(); // Get the ee.Image

    // Apply the mask
    var maskedImage = eeImage.updateMask(mask);
    
    // Replace the existing layer with the masked image
    map.layers().set(layerIndex, ui.Map.Layer(maskedImage, {}, currentLayer.getName()));

};

// testing
/*var img = ee.Image('COPERNICUS/S2_SR/20210109T185751_20210109T185931_T10SEG');
var trueColorViz = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 2700,
  gamma: 1.3
};
ui.root.clear();
//var panel = ui.Panel({style: {width: '250px'}});
var map = ui.Map();
//ui.root.add(panel).add(map); // order that you add panl vs map affects if panel is right or left
ui.root.add(map); 
map.setCenter(-122.36, 37.47, 10);
map.addLayer(img, trueColorViz, 'Sentinel-2 image');

// Create a Boolean land mask from the SWIR1 band; water is value 0, land is 1.
var landMask = img.select('B11').gt(100);
//applyMaskToLayer(map, 0, landMask)
map.addLayer(landMask, {palette: ['blue', 'lightgreen']}, 'Land mask');
map.addLayer(img.updateMask(landMask), trueColorViz, 'Sentinel-2 image');
*/
// end testing
