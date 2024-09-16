var jp = require('jsonpath');
var returnhandle = require('../utils/returnHandler.js');
var pointer = require('json-pointer');

function getPath(options, targetField) {
  console.log(options, targetField);
  returnhandle.returnHandler(options)
}

// Checks JSON object array fields for unique list of keys.
module.exports.checkUnique = function(options) {
  options.targetobj = jp.query(options.childSchema, options.path + "." + options.fieldname);
  console.log(options.targetobj);
  if (options.targetobj instanceof Array) {
    let sizearray = options.targetobj.length;
    if (new Set(options.targetobj).size !== sizearray) {
      returnhandle.returnHandler(options);
    }
  }
}


// Checks JSON object or JSON object array fields against a regex expression
module.exports.checkMatch = function(options) {
  var regex = new RegExp(options.regexp);
  for (let i = 0; i < options.targetobj.length; i++) {
    if (options.fieldname) {
      if (!regex.test(options.targetobj[i][options.fieldname])) {
        options.errPath = jp.stringify(options.targetpaths[i]) + '/' + options.fieldname;
        returnhandle.returnHandler(options);
      }
    } else {
      if (!regex.test(Object.keys(options.targetobj[i]))) {
        options.errPath = jp.stringify(options.targetpaths[i]);
        returnhandle.returnHandler(options);
      }
    }
  }
}

// Checks JSON object array length within an acceptable min or max size
module.exports.checkLength = function(options) {
  if (options.targetobj instanceof Array) {
    console.log(options.targetobj.length, options.targetpaths)
    if (!((options.targetobj.length <= options.maxSize) && (options.targetobj.length >= options.minSize))) {
      options.targetpaths[0].pop()
      console.log(options.targetpaths[0])
      options.errPath = jp.stringify(options.targetpaths[0]);
      returnhandle.returnHandler(options)
    }
  }
}

// Checks JSON object's field exist
module.exports.checkfieldExists = function(options) {
  for (let i = 0; i < options.targetobj.length; i++) {
    if (typeof(options.targetobj[i][options.fieldname]) == 'undefined') {
      options.errPath = jp.stringify(options.targetpaths[i]) + '.' + options.fieldname;
      returnhandle.returnHandler(options);
    }
  }
}

// Checks JSON object's field does not exist
module.exports.checkfieldNotExists = function(options) {
  for (let i = 0; i < options.targetobj.length; i++) {
    if (typeof(options.targetobj[i][options.fieldname]) != 'undefined') {
      options.errPath = jp.stringify(options.targetpaths[i]) + '.' + options.fieldname;
      returnhandle.returnHandler(options);
    }
  }
}

// Checks JSON object has fields within the enum values listed enumValue should be seperated by ","
module.exports.checkEnum = function(options) {
  var arr = [];
  options.enumValue.split(",").forEach((el) => {
    arr.push(el);
  });
  const enumarr = new Set(arr);

  for (let i = 0; i < options.targetobj.length; i++) {
    if (!options.fieldname) {
      Object.keys(options.targetobj[i]).forEach((el) => {
        if (!enumarr.has(el)) {
          options.errPath = jp.stringify(options.targetpaths[i]) + '/' + el;
          returnhandle.returnHandler(options);
        }
      });
    } else {
      if (!enumarr.has(options.targetobj[i])) {
        options.errPath = jp.stringify(options.targetpaths[i]) + '/' + options.targetobj[i];
        returnhandle.returnHandler(options);
      }
    }
  }
}

// TO:DO - This function works but had issues using ajv to compile and validate
// module.exports.checkJsonSchema = function(options) {
//   const ajv = new Ajv({
//     strict: false
//   });
//   const schemaObj = jsonSchemaGenerator(options.parentSchema);
//
//   //ajv does not compile with the next two keys so deleting it.
//   pointer.remove(schemaObj, '/$schema');
//   pointer.remove(schemaObj, '/description');
//   const validate = ajv.compile(schemaObj);
//   const valid = validate(options.childSchema);
//   if (!valid) console.log(validate.errors);
// }
