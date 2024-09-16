
// Check if operationId is unique
  // parser.parser('../sample_oas.json',
  // '../sample_translation.json',
  // {
  //   "function": basic.checkUnique,
  //   "functionName": "checkUnique"
  // }, '$.paths[*][*]', {
  //   "ruledesc": "Check Unique",
  //   "level": "warn",
  //   "field": "operationId",
  //   "errmsg": "Elements are not unique"
  // });
//
// //Check if names in parameter are unique
//   parser.parser('../sample_oas.json',
//   '../sample_translation.json',
//   {
//     "function": basic.checkUnique,
//     "functionName": "checkUnique"
//   }, '$.paths[*][*].parameters[*]', {
//     "ruledesc": "Check Unique",
//     "level": "warn",
//     "field": "name",
//     "errmsg": "Elements are not unique"
//   });
//
//   // TODO: when passing strings with / or { } in the arguments
//
// //Check if only one server URL
//   parser.parser('../sample_oas.json',
//   '../sample_translation.json',
//   {
//     "function": basic.checkLength,
//     "functionName": "checkLength"
//   }, '$.servers[*]', {
//     "ruledesc": "Check Length of servers",
//     "level": "warn",
//     "maxSize": 1,
//     "minSize": 1,
//     "errmsg": "Length not defined within limits "
//   });
//
//Check if url matches regex exp
  // parser.parser('../sample_oas.json',
  // '../sample_translation.json',
  // {
  //   "functionName": "checkMatch",
  //   "path": "$.servers[*]",
  //   "ruledesc": "Check if server matches URL regex",
  //   "fieldname": "url",
  //   "regexp": "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})",
  //   "level": "warn",
  //   "errmsg": "Expression does not seem to be a URL."
  // });


//
// //Check if field exists , check if a base url exists
//   parser.parser('../sample_oas.json',
//   '../sample_translation.json',
//   {
//     "function": basic.checkfieldExists,
//     "functionName": "checkfieldExists"
//   }, '$', {
//     "ruledesc": "Check Field Exists",
//     "fieldname": "servers",
//     "level": "warn",
//     "errmsg": "Field does not exist"
//   });
//
//   parser.parser('../sample_oas.json',
//   '../sample_translation.json',
//   {
//     "function": basic.checkfieldExists,
//     "functionName": "checkfieldExists"
//   }, '$.paths[*][*].responses[*]', {
//     "ruledesc": "Check if response field exists",
//     "fieldname": "content",
//     "level": "warn",
//     "errmsg": "Content field does not exist for response code"
//   });
//
// //check if http methods are within enum values
  // parser.parser('../sample_oas.json',
  // '../sample_translation.json',
  // {
  //   "function": basic.checkEnum,
  //   "functionName": "checkEnum"
  // }, '$.paths[*]', {
  //   "ruledesc": "Check HTTP methods",
  //   "level": "warn",
  //   "enumValue": "get,post,put,delete",
  //   "errmsg": "HTTP methods out of recommended values"
  // });
//
//   //Should have atleast one numeric or non-default response code
  // parser.parser('../sample_oas.json',
  // '../sample_translation.json',
  // {
  //   "function": basic.checkfieldNotExists,
  //   "functionName": "checkfieldNotExists"
  // }, '$.paths[*][*].responses', {
  //   "ruledesc": "Check if response code is not default",
  //   "fieldname":"default",
  //   "level": "warn",
  //   "errmsg": "Response code includes non-numeric/default value"
  // });
//
//   // Check Json schema of translation file against original swaggerFile
  // parser.parser('../sample_oas.json',
  // '../sample_translation.json',
  // {
  //   "function": basic.checkJsonSchema,
  //   "functionName": "checkJsonSchema"
  // }, '$.paths[*].get', {
  //   "ruledesc": "Check JSON subschema",
  //   "level": "warn",
  //   "errmsg": "Not JSON schema"
  // });

  // Check if type exists
  // parser.parser('../sample_oas.json',
  // '../sample_translation.json',
  //  {
  //   "function": basic.checkfieldExists,
  //   "functionName": "checkfieldExists"
  // }, '$.paths[*][*].parameters[*].schema', {
  //   "ruledesc": "Check Field Exists",
  //   "fieldname": "type",
  //   "level": "warn",
  //   "errmsg": "Field does not exist"
  // });

var parser = require('./parser.js');

  // parser.parser('../sample_oas.json',
  // '../sample_translation.json',
  // {
  //   "function": custom.customFunction,
  //   "functionName": "customFunction"
  // }, '$.paths[*].get', {
  //   "ruledesc": "Custom Function",
  //   "level": "warn",
  //   "errmsg": "Custom function err",
  //   "customFunctionName": "check_path",
  //   "code":'../pythonCode.py'
  // });
  //
// rules();

//checkMatch Tested
//this is what the user can call
// let result = parser.parser('./sample_oas.json', './sample_translation.json', {
//   "id": "Rule2", //get this from mongodb
//   "functionName": "checkMatch",
//   "path": "$.servers[*]",
//   "ruledesc": "Check if server match Rule2",
//   "fieldname": "url",
//   "regexp": "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})",
//   "level": "warn",
//   "errmsg": "Expression does not seem to be a URL."
// });

// let result = parser.parser('./sample_oas.json', './sample_translation.json', {
//   "id": "Rule2", //get this from mongodb
//   "functionName": "checkMatch",
//   "path": "$.paths[*][*].responses",
//   "ruledesc": "Check if server match Rule2",
//   "regexp": "^20[0-9]+",
//   "level": "warn",
//   "errmsg": "Expression does not seem to be a success code."
// });

let result = parser.parser('./sample_oas.json', './sample_translation.json', {
   "id": "Rule2", //get this from mongodb
   "functionName": "checkMatch",
   "path": "$",
   "ruledesc": "Check if server match Rule2",
   "fieldname":"openapi",
   "regexp": "3.0.0",
   "level": "warn",
   "errmsg": "Expression does not seem to be a success code."
 });

// checkEnum

// let result = parser.parser('./sample_oas.json', './sample_translation.json', {
//   "id": "Rule2", //get this from mongodb
//   "functionName": "checkEnum",
//   "path": "$.paths[*]",
//   "ruledesc": "Check HTTP methods",
//   "enumValue": "get,post,put,delete",
//   "level": "warn",
//   "errmsg": "Expression does not seem to be a success code."
// });


//checkLength

// use to check if parameters are selected

// let result = parser.parser('./sample_oas.json', './sample_translation.json', {
//   "id": "Rule2", //get this from mongodb
//   "functionName": "checkLength",
//   "path": "$.servers[*]",
//   "ruledesc": "Check Length of servers",
//   "maxSize": 3,
//   "minSize": 2,
//   "level": "warn",
//   "errmsg": "Expression does not seem to be a success code."
// });

// '$.servers[*]', {
//     "ruledesc": "Check Length of servers",
//     "level": "warn",
//     "maxSize": 1,
//     "minSize": 1,
//     "errmsg": "Length not defined within limits "

// use to check if multiple servers are selected

console.log(result);


// parser('../sample_oas.json',customFunction,'$.paths[*]',{"code":"import numpy;x=1+1;print(x)"})

