/*
Description: functions for visualizations


*/

// creating legends -------------------------------------------------------------


// Creates and styles 1 row of the legend.
exports.makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: color,
          // Use padding to give the box height and width.
          padding: '4px',
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