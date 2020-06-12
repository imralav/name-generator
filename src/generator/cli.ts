import {argv} from "yargs";
import inquirer from "inquirer";
import logger from "../logger";
import {generateMultipleNamesFromOptions} from "./GeneratorOptionsLoader";

function promptForOperation(): Promise<any> {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'operation',
            message: 'What do you want to do? (generate|exit)',
            default: 'generate',
            choices: [
                'generate',
                'exit'
            ]
        }
    ]).catch(error => {
        logger.error(`An error occured: ${error}`);
    });
}

function promptForGeneration(): Promise<any> {
    return inquirer.prompt([
        {
            type: 'number',
            name: 'amount',
            message: 'How many names to generate?',
            default: '1'
        }
    ]).catch(error => {
        logger.error(`An error occured: ${error}`);
    });
}

function operateCli(previousChoice: string) {
    if (previousChoice === 'exit') {
        return;
    }
    promptForOperation().then(operationAnswers => {
        if (operationAnswers.operation === 'generate') {
            return promptForGeneration().then(generationAnswers => {
                const optionsFile = argv.optionsFile as string;
                return generateAndPrintMultipleNames(optionsFile, generationAnswers.amount)
                    .then(() => Promise.resolve('repeat'));
            });
        } else if (operationAnswers.operation === 'exit') {
            return Promise.resolve('exit');
        } else {
            return Promise.resolve('repeat');
        }
    }).then(operateCli);
}

function generateAndPrintMultipleNames(optionsFile: string, namesToGenerate: number) {
    return generateMultipleNamesFromOptions(optionsFile, namesToGenerate)
        .then(names => {
            names.forEach((name, i) => logger.info(`${i + 1}: ${name}`));
        })
        .catch(error => {
            logger.error(`An error occured: ${error}`);
        });
}


export {operateCli};