import winston from "winston";

const { colorize, combine, timestamp, json, prettyPrint, errors } =
  winston.format;

const productionFormat = combine(errors({ stack: true }), timestamp(), json());
const developmentFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json(),
  prettyPrint(),
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format:
    process.env.NODE_ENV === "production"
      ? productionFormat
      : developmentFormat,
  transports: [new winston.transports.Console()],
});

export { logger };
