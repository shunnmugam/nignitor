var winston = require("winston");
var path = require("path");
require("winston-daily-rotate-file");
const { combine, timestamp, json } = winston.format;
var context = require("../utils/context");
var morgan = require("morgan");
const Helper = require('../Helper');
var logger;

class Logger {
  constructor(app) {
    this.app = app;
  }

  register() {
    const config = use("config");
    const logsConfig = config("logs");
    var transport = new winston.transports.DailyRotateFile({
      filename: path.join(Helper.getRootPath(), `./logs/application-%DATE%.log`),
      datePattern: logsConfig.fileNameDatePattern,
      zippedArchive: logsConfig.zippedArchive,
      maxSize: logsConfig.maxSize,
      maxFiles: logsConfig.maxFiles
    });

    // instantiate a new Winston Logger with the settings defined above
    logger = winston.createLogger({
      format: combine(
        timestamp({
          format: logsConfig.timestampFormat
        }),
        json()
      ),
      transports: [
        transport
        // new winston.transports.Console(options.console)
      ],
      exitOnError: false // do not exit on handled exceptions
    });

    var info = logger.info;
    var error = logger.error;
    logger.info = function() {
      if (logsConfig.isActive == true) {
        var uId = context.get("uId");
        if (uId) {
          var message = arguments[0];
          if (typeof message === "object") {
            message["requestId"] = uId;
            message = JSON.stringify(message);
          }
          message = message.replace(/\n/g, " ");
          var otherParameter = Array.prototype.shift.apply(arguments);
          if (message.indexOf(`requestId`) !== -1) {
            info(message, otherParameter);
          } else {
            info(
              `{"message": "${message}","requestId": "${uId}"}`,
              otherParameter
            );
          }
        } else {
          info(...arguments);
        }
      }
    };

    logger.error = function() {
      if (logsConfig.isActive == true) {
        var uId = context.get("uId");
        if (uId) {
          var message = arguments[0];
          if (typeof message === "object") {
            message["requestId"] = uId;
            message = JSON.stringify(message);
          }
          message = message.replace(/\n/g, " ");
          var otherParameter = Array.prototype.shift.apply(arguments);
          if (message.indexOf(`requestId`) !== -1) {
            error(message, otherParameter);
          } else {
            error(
              `{"message": "${message}", "requestId": "${uId}"}`,
              otherParameter
            );
          }
        } else {
          error(...arguments);
        }
      }
    };

    // create a stream object with a 'write' function that will be used by `morgan`
    logger.stream = {
      write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
      }
    };
  }

  boot() {
    use("logger", logger);

    morgan.token("status", function(req, res) {
      if (res.body) return res.body.status;
      else return "";
    });
    morgan.token("user", function(req, res) {
      if (req.session.cas_user) {
        return req.session[config('cas.sessionName')];
      } else {
        return "unknown";
      }
    });

    morgan.token("ip", function(req) {
      var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      return ip;
    });

    morgan.token("requestId", function(req) {
      return context.get("uId");
    });

    morgan.token("queryParams", function(req, res) {
      if (req.query) {
        let s = "";
        Object.keys(req.query).map(k => {
          s = s + (k + "=" + req.query[k]) + ",";
        });
        return s;
      } else {
        return "-";
      }
    });

    morgan.token("bodyParams", function(req, res) {
      if (req.body) {
        let s = "";
        Object.keys(req.body).map(k => {
          s = s + (k + "=" + req.body[k]) + ",";
        });
        return s;
      } else {
        return "-";
      }
    });
    //middlewares
    this.app.use(
      morgan(
        `{"requestId" : ":requestId","user" : ":user","remoteAddr": ":remote-addr","time": ":date[clf]","remoteUser": ":remote-user","method": ":method","url": ":url","status" : ":status","userAgent" : ":user-agent","referrer" : ":referrer", "queryParams" : ":queryParams", "bodyParams" : ":bodyParams", "responseTime": ":response-time","ip": ":ip"}`,
        {
          stream: logger.stream,

          skip: function(req, res) {
            return req.url.indexOf("/api/logs") !== -1;
          }
        }
      )
    ); //logger

    const logsRouter = require('../routes/logs');
    this.app.use('/', logsRouter)
  }
}

module.exports = Logger;
