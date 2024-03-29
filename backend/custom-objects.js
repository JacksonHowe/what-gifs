/*
 *   Custom objects can be created and called from here
 *   To add a new function/object, write the function and add it as an
 *   export at the end of the file
 */

//Probably need to require loading the captions here

//Return Error Obj
function returnError(s = 400, m = "Bad Request") {
  var obj = { status: s, msg: m };
  return obj;
}

//Return an object with the captions array
function sendCaptions() {
  var obj = { status: 200, captions: [1, 2, 3, 4, 5] };
  return obj;
}

exports.error = returnError;
exports.captions = sendCaptions;
