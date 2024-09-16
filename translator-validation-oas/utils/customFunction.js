let {
  PythonShell
} = require('python-shell');
var fs = require('fs');
const compile = require('compile-template')
let assert = require('assert');
let Promise = require('bluebird');
let pythonBridge = Promise.promisifyAll(require('python-bridge'));
var returnhandle = require('../utils/returnHandler.js');
var jp = require('jsonpath');
module.exports.checkCustomFunction = function(swaggerFile, newswaggerFile, options) {
  //Create Python Script, add template here that accepts arguments

  // extract target and parent swagger schema
  options.parentSchema = swaggerFile;
  options.childSchema = newswaggerFile;

  var target = JSON.stringify(options.childSchema);
  var source = JSON.stringify(options.parentSchema);


  // Compile template from customTemplate.py
  const template = compile(fs.readFileSync(__dirname + '/customTemplate.py', 'utf8'));
  options.errPath = jp.stringify(options.path);

  const script = template({
    funcname: options.customFunctionName,
    code: options.code,
    targetobj: target,
    sourceobj: source
  });

  // Creates and saves code to Python executable file under scripts/
  var script_path = __dirname + '/scripts/' + 'exectuePy' + options.customFunctionName + '.py';
  fs.writeFileSync(script_path, script, function(err) {
    if (err) throw err;
    console.log('New Python Script is created successfully.');
  });

  // Default set of python options, use this to add env
  let py_options = {
    pythonOptions: ['-u'],
  };

  return new Promise((resolve, reject) => {

    PythonShell.run(script_path, py_options, function(err, results) {
      // Always make sure results is either returning a Success or a Failute
      console.log(script_path, err, results);
      if (err) {
        resolve("Fail");
      } else if (results[0] == "Success") {
        resolve("Success");
      } else {
        returnhandle.returnHandler(options);
        resolve();
      }
    });

  });


}
