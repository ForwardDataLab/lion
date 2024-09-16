let {
  PythonShell
} = require('python-shell');
var fs = require('fs');
const compile = require('compile-template')
var jp = require('jsonpath');
module.exports.checkCustomFunction = function (options) {
  //Create Python Script, add template here that accepts arguments

  // extract target object
  var target = JSON.stringify(options.childSchema);


  // compile template from customTemplate.py
  const template = compile(fs.readFileSync(__dirname + '/customTemplate.py', 'utf8'));

  const script = template({funcname:options.customFunctionName,
                          code:options.code,
                          targetobj: target});

  // Save script to file in utils
  var script_path = __dirname+'/scripts/'+'exectuePy.py';
  fs.writeFileSync(script_path,script, function (err) {
  if (err) throw err;
  console.log('New Python Script is created successfully.');
  });

  let py_options = {
    pythonOptions: ['-u'],
  };

  // execute script and return err , call returnHandler
  PythonShell.run(script_path, py_options, function (err, results) {
  console.log('results: %j', results);
  });

// delete script after run
  // fs.unlinkSync(script_path);



}
