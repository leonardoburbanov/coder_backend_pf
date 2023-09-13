import winston from "winston";
import * as dotenv from "dotenv";
import __dirname from '../utils.js';
import path from "path";
dotenv.config();

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "magenta", // Magenta
        warn: "yellow",
        info: "blue",
        http: "green",
        debug: "cyan", // Cyan
    },
};

// Define a custom colorizer function for console logger
const customColorizer = winston.format.colorize({
    all: true,
    colors: customLevels.colors,
    level: true,
    message: true,
});

const consoleLoggerFormat = winston.format.combine(
    customColorizer,
    winston.format.simple(),
);

const fileLoggerFormat = winston.format.combine(
    winston.format.simple(),
);

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: consoleLoggerFormat,
        }),
    ],
});

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: consoleLoggerFormat,
        }),
        new winston.transports.File({
            filename: path.join(__dirname, "/logs/errores.log"),
            level: "info",
            format: fileLoggerFormat, // Use the custom format for file transport
        }),
    ],
});

const currentEnv = process.env.NODE_ENV || "development";

export const addLogger = (req, res, next) => {
    if (currentEnv === "development") {
        req.logger = devLogger;
    } else {
        req.logger = prodLogger;
    }
    req.logger.http(`${req.url} - method: ${req.method}`);
    next();
};
