import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const { combine, timestamp, json, prettyPrint, errors } = winston.format;

const productionFormat = combine(errors({ stack: true }), timestamp(), json());

const developmentFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json(),
  prettyPrint()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format:
    process.env.NODE_ENV == "production" ? productionFormat : developmentFormat,
  transports:
    process.env.NODE_ENV === "production"
      ? [
          new LogtailTransport(
            new Logtail(process.env.LOGTAIL_SOURCE_TOKEN || "NO_TOKEN")
          ),
        ]
      : [new winston.transports.Console()],
});

export { logger };
