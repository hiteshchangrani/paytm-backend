const winston = require("winston");
const { GELFTransport } = require("winston-gelf");

const logger = winston.createLogger({
  transports: [
    new GELFTransport({
      gelfPro: {
        adapterName: "http",  // Sends logs over HTTP
        adapterOptions: {
          host: "your-graylog-server-ip",  // Replace with your Graylog server IP or domain
          port: 12201,
        },
      },
    }),
    new winston.transports.Console(), // Keep console logging for debugging
  ],
});

module.exports = logger;
