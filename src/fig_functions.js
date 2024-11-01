/*
Description: functions for visualizations


*/


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
exports.makeRow = function(color, name) {
 
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
          fontSize: '11px'
        }
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
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
exports.makeVisParamsRampLegend = function(existing_panel, visParams, title, label1, label2) {
  var min = visParams.min;
  var max = visParams.max;
  
  if (label1 === undefined || label1 === null){
    var label1 = min;
  }
  
  if (label2 === undefined || label2 === null){
    var label2 = max;
  }
  var lon = ee.Image.pixelLonLat().select('longitude');
  var gradient = lon.multiply((max - min)/100.0).add(min);
  var legendImage = gradient.visualize(visParams);
  var thumb = ui.Thumbnail({
    image: legendImage,
    params: {bbox:'0,0,100,8', dimensions:'128x10'},
    style: {
      position: 'bottom-center',
      padding: '0px 0px 0px 0px'
    } 
  });
  var styleLabel = {
        fontSize: '10px',
        margin: '0 0 0 0',
        padding: '0'
    };
  var panel2 = ui.Panel({
    widgets: [
      ui.Label({value: label1, style: styleLabel}),
      ui.Label({style: {stretch: 'horizontal'}}),
      ui.Label({value: label2, style: styleLabel}) 
      ],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal', maxWidth: '270px', padding: '0px 0px 0px 0px'}
    
  });
  var new_panel = existing_panel
  // adding a title
    .add(ui.Label({
      value: title,
      style: {
        fontWeight: 'bold',
        fontSize: '11px',
        margin: '0px 0px 4px 0px',
        padding: '0'
    }
  }))
    .add(panel2)
    .add(thumb);
  return new_panel;
};

// working with layers ---------------------------------------------------------

// remove a map layer based on it's index
exports.removeLayer = function(mapToChange, index) {
  var lay = mapToChange.layers().get(index);
  if(lay){
    mapToChange.remove(lay);
  }
};
