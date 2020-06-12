import {createLogger, format, transports} from 'winston';
import {argv} from 'yargs';

const logger = createLogger({
    level: argv.LOG_LEVEL as string || 'info',
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [
        new transports.Console()
    ]
});

export default logger;