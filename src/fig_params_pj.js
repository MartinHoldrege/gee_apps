// Load some raster data: CONUS mean daily max temperature for January 2010
var tmax = ee.Image('OREGONSTATE/PRISM/AN81m/201001').select('tmax');

// Get a palette: a list of hex strings
var palettes = require('users/gena/packages:palettes');
var palette = palettes.matplotlib.viridis[7];
 
// Display max temp with defined palette stretched between selected min and max
Map.addLayer(tmax, {min: -11, max: 25, palette: palette}, 'tmax');