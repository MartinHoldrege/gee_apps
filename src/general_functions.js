/*
 General javascript functions


*/

// create a copy of a dictionary 
var copyDict = function(originalDict) {
    var newDict = {}; // Create an empty object

  // Copy all key-value pairs from the original dictionary to the new one
  for (var k in originalDict) {
    if (originalDict.hasOwnProperty(k)) {
      newDict[k] = originalDict[k];
    }
  }
  
  return newDict;
}

exports.copyDict = copyDict;

// Function to copy the dictionary and update a key (i.e. not change in place)
exports.updateDict = function(originalDict, key, newValue) {
  var newDict = copyDict(originalDict);

  // Update the specified key with the new value
  newDict[key] = newValue;

  return newDict;
};



// takes a dictionary, and list of keys in that dictionary,
// returns copy of dictionary with specified keys removed. 
exports.removeKeys = function(originalDict, keysToRemove) {
  var newDict = {}; // Create an empty object

  // Copy all key-value pairs from the original dictionary to the new one
  for (var k in originalDict) {
    if (originalDict.hasOwnProperty(k)) {
      newDict[k] = originalDict[k];
    }
  }

  // Update the specified key with the new value
  keysToRemove.forEach(function(key) {
    delete newDict[key];
  });

  return newDict;
};

// determine if an item exists in a list
var listIncludes = function(list, item) {
  if (list.indexOf(item) !== -1) {
    return true;
  } else {
    return false;
  } 
};

exports.listIncludes = listIncludes;


/*
// Example:
var x = ['a', 'b']
print(listIncludes(x, 'b'))
print(listIncludes(x, 'c'))
*/

exports. reverseDictionary = function(x) {
  var reverse = {};
  for (var k in x) {
    if (x.hasOwnProperty(k)) {
      reverse[x[k]] = k;
    }
  }
  return  reverse;
};