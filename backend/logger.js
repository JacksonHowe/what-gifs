const path = require("path");
const { createLogger, format, transports } = require("winston");
const { colorize, combine, timestamp, label, printf } = format;

const log_level = "info"; // TODO: Change to less aggressive log level after development

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
var getLabel = function(callingModule) {
  var parts = callingModule.filename.split(path.sep);
  return parts[parts.length - 2], parts.pop();
};

module.exports = function(callingModule) {
  return new createLogger({
    transports: [
      new transports.Console({
        level: log_level,
        format: combine(
          label({ label: getLabel(callingModule) }),
          timestamp(),
          colorize(),
          myFormat
        )
      }),
      new transports.File({
        level: log_level,
        filename: "stdout.log",
        format: combine(
          label({ label: getLabel(callingModule) }),
          timestamp(),
          myFormat
        )
      })
    ]
  });
};
