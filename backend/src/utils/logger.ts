import winston from "winston";
import 'dotenv/config';
import { TIMEZONE } from "./contants";

const timeZoned = () => {
    const options = {
        timeZone: TIMEZONE,
        hour12: false,
    }
    const now = new Date().toLocaleString('ja-JP', options);
    return now;
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

// Add colors
winston.addColors(colors)

// Define log formats
const logFormats = winston.format.combine(
    winston.format.timestamp({ format: timeZoned }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

// Define log transports
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }), // Colorize for console
            logFormats
        ),
    }),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: logFormats,
    }),
    new winston.transports.File({ 
        filename: 'logs/all.log',
        format: logFormats,
    }),
];

// Create a logger instance
const logger = winston.createLogger({
    level: level(),
    levels,
    transports
});

export default logger;