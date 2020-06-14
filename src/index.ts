import logger from './logger';
import {generateMultipleNamesFromOptions} from "./generator/GeneratorOptionsLoader";
import {argv} from "yargs";
import {operateCli} from "./generator/cli/cli";

const cliRequested = argv.cli;

if (cliRequested) {
    operateCli();
} else {
    const namesToGenerate = argv.amount as number || 1;
    const optionsFile = argv.optionsFile as string;
    generateMultipleNamesFromOptions(optionsFile, namesToGenerate)
        .then(names => {
            names.forEach((name, i) => logger.info(`${i + 1}: ${name}`));
        })
        .catch(error => {
            logger.error(`An error occured: ${error}`);
        });
}
