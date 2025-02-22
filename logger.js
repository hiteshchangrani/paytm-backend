const { createLogger, transports, format } = require("winston");
const GelfTransport = require("winston-gelf");

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transports.Console(),
    new GelfTransport({
      gelfPro: {
        adapterName: "udp",
        adapterOptions: {
          host: "127.0.0.1", // Update to your Graylog server if needed
          port: 12201
        }
      }
    })
  ]
});

module.exports = logger;
