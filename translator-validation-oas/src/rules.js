var parser = require('./parser.js');
var returnhandle = require('../utils/returnHandler.js');
let Promise = require('bluebird');
var oasValidate = require('./oasValidation.js');
var custom = require('../utils/customFunction.js');
const oas_validator = require('oas-validator-lxwang2');
// Function to run async custom rules
function custom_array_call(swaggerFile,
  newswaggerFile, custom_array) {

  var Promisearray = [];
  Promisearray.length = custom_array.length;

  for (i = 0; i < custom_array.length; i++) {
    // Collect promise objects from all custom functions
    Promisearray[i] = custom.checkCustomFunction(swaggerFile,
      newswaggerFile,
      custom_array[i]);
  }
  // Promise.all waits for all custom functions to finish
  return new Promise.all(Promisearray)
    .then((values) => {
      console.log(values);
    });
}


module.exports.rules = function(swaggerFile, newswaggerFile, jsonItr) {
  custom_array = [];
  non_custom_array = [];
  returnhandle.initializeLoggerList();

  // Validate OAS schema
  var oasValid = oasValidate.oasValidate(newswaggerFile, {});

  // Check to confirm if OAS validation was successful otherwise don't continue with rule checks
  
  // Iterate through rule objects array and seperate them into custom and reusable functions.
  // Reusable function implementation is synchronous whereas custom function is asynchronous
  // so we seperate the two rules and execute it one after the other
  if (jsonItr instanceof Array) {
    for (i = 0; i < jsonItr.length; i++) {
      if (jsonItr[i].functionName != 'checkCustomFunction') {
        non_custom_array.push(jsonItr[i]);
      } else {
        custom_array.push(jsonItr[i]);
      }
    }
  }
  // Iterate through reusable functions and invoke the call
  for (i = 0; i < non_custom_array.length; i++) {
    var successcode = parser.parser(swaggerFile,
      newswaggerFile,
      non_custom_array[i]);
  }

  // Call custom array functions asynchronous
  // Return Promise object to the caller function
  return new Promise((resolve, reject) => {
    custom_array_call(swaggerFile,
        newswaggerFile, custom_array)
      .then(results => console.log("Completed Custom Functions", results))
      .then(results => resolve(returnhandle.getResults()));
  });
}
