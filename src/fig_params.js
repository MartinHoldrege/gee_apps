/*
  Purpose: functions and other elements for visualizations

  Author: Martin Holdrege
  
  Started: Oct 14, 2024
*/

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
          fontSize: '12px'
        }
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};
 

// Add color and and names
for (var i = 0; i < c9Palette.length; i++) {
  legend.add(makeRow(c9Palette[i], c9Names[i]));
  }  
 
exports.legendc9 = legend;