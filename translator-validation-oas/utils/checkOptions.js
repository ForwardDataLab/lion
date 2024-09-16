let definedProp = 1;
let undefinedProp = 0;
var basic = require('../utils/basicFunctions.js');
var custom = require('../utils/customFunction.js');

function checkProperty(options, propertyNameList,objfunc) {
  var errflag=0;
  for (var i = 0; i < propertyNameList.length; i++) {
    if (!options.hasOwnProperty(propertyNameList[i])) {
      console.log("Property " + propertyNameList[i] + " missing.");
      errflag=1
    }
  }
  // If err, return 0 else return function to execute
  return errflag? undefinedProp: objfunc;
}

// Function to check if right options/parmeters for rule function exist in args
module.exports.checkOptions = function(functionName, options) {
  var propertyNameList=['ruledesc','errmsg','path'];
  switch (functionName) {
    case "checkMatch":
      propertyNameList.push('regexp');
      return checkProperty(options, propertyNameList,basic.checkMatch );
      break;
    case "checkLength":
      propertyNameList.push('maxSize', 'minSize');
      return checkProperty(options, propertyNameList,basic.checkLength);
      break;
    case "checkfieldExists":
      propertyNameList.push('fieldname');
      return checkProperty(options, propertyNameList,basic.checkfieldExists);
      break;
    case "checkfieldNotExists":
      propertyNameList.push('fieldname');
      return checkProperty(options, propertyNameList,basic.checkfieldNotExists);
      break;
    case "checkEnum":
      propertyNameList.push('enumValue');
      return checkProperty(options,propertyNameList,basic.checkEnum);
      break;
    case "checkJsonSchema":
      propertyNameList.push('parentSchema','childSchema');
      return checkProperty(options,propertyNameList,basic.checkJsonSchema);
      break;
    case "checkUnique":
      propertyNameList.push('fieldname');
      return checkProperty(options,propertyNameList,basic.checkUnique);
      break;
    case "checkCustomFunction":
      propertyNameList.push('code','customFunctionName');
      return checkProperty(options,propertyNameList,custom.checkCustomFunction);
      break;
    default:
      return checkProperty(options, propertyNameList);
      break;

  }
}
