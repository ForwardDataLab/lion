const validator = require('oas-validator-lxwang2');
const options = {};
var returnhandle = require('../utils/returnHandler.js');

// OAS validation check
module.exports.oasValidate = function(openapi, options) {

  validator.validate(openapi, options)
    .then(function(options) {
      console.log("Success");
    })
    .catch(function(err) {
      if (options.context) returnhandle.returnHandler({
        "ruledesc": "OAS Validation",
        'errmsg': "Incorrect Swagger schema",
        'path': options.context.pop(),
        'level': 'warn',
        'errPath': 'OASfileError'
      });
    });
}
