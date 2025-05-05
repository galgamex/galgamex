import * as fs from 'fs';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logDir: string = process.env.LOG_DIR || 'log';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const fileTransport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '3d',
  level: 'info',
});

const logger: winston.Logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    fileTransport,
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export default logger;
