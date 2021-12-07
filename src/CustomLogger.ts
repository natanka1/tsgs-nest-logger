import * as winston from 'winston';
import { DynamicModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

export enum levels { 
    error= "error",
    warn= "warn",
    info= "info",
    http= "http",
    verbose= "verbose",
    debug= "debug",
    silly="silly",
};

const {name, version} = require('../package.json');
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level} [${label}:${version} ]  ${message}`;
  });

export const defaultOptions = {
    level: levels.info,
    format: combine(
        label({ label: name}),
        timestamp(),
        myFormat,
        winston.format.colorize({all: true}),
        // TODO - to json
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console(),
    ],
}

export function createLogger(options?){
    const logger = winston.createLogger(defaultOptions)
    return logger;
}

export function createLoggerService(options?): LoggerService{
   const loggerService = WinstonModule.createLogger(defaultOptions);
   return loggerService;
}

export function createLoggerModuleSync(options?): DynamicModule {
    const module = WinstonModule.forRoot(defaultOptions)
    return module;
}