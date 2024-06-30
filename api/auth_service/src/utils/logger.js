const { transports, format, createLogger } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ level: "warn", filename: "logs/warning.log" }),
    new transports.File({ level: "info", filename: "logs/info.log" }),
    new transports.File({ level: "error", filename: "logs/error.log" }),
    new transports.MongoDB({
      level: "info",
      db: process.env.MONGODB_URI,
      storeHost: true,
      options: { useUnifiedTopology: true },
      collection: "authLogs",
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}] : ${message}`;
        })
      ),
    }),
  ],

  format: format.combine(
    format.json(),
    format.prettyPrint(),
    format.timestamp(),
    format.metadata()
  ),
});

module.exports = logger;
