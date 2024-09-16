var jp = require('jsonpath');
var basic = require('../utils/checkOptions.js');

module.exports.parser = function(swaggerFile, newswaggerFile, options) {

    options.parentSchema  = swaggerFile;
    options.childSchema =  newswaggerFile;
    options.targetobj =  jp.query(options.childSchema, options.path);
    options.targetpaths =  jp.paths(options.childSchema, options.path);

    var checkOptns = basic.checkOptions(options.functionName, options);

    // Check if arg requirements for function satisfies, then run the function
    if (checkOptns)
    {
      // checkOptn contains the function, so below we just call it
      console.log(checkOptns);
      checkOptns(options);
    }
    else {
      console.log("Could not run rule: insufficient args");
    }

    return;
}
