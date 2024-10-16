/*
 General javascript functions


*/


// Function to copy the dictionary and update a key (i.e. not change in place)
exports.updateDict = function(originalDict, key, newValue) {
  var newDict = {}; // Create an empty object

  // Copy all key-value pairs from the original dictionary to the new one
  for (var k in originalDict) {
    if (originalDict.hasOwnProperty(k)) {
      newDict[k] = originalDict[k];
    }
  }

  // Update the specified key with the new value
  newDict[key] = newValue;

  return newDict;
}