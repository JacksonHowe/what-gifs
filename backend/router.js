const parse = (method, game) => {
  var ret = { status: 200 };
  switch (method) {
    case "getgif":
      break;
    case "submitcaption":
      break;
    case "choosewinner":
      break;
    case "eliminatecaption":
      break;
    case "newgame":
      break;
    case "replacecaption":
      break;
    default:
      ret.status = 400;
      break;
  }
  return ret;
};

module.exports = { parse };
