import {NameGeneratorOptions} from "./options";
import logger from "../logger";
import fs from "fs";
import DEFAULT_OPTIONS from './DEFAULT_OPTIONS';
import path from "path";
import {NameGenerator} from "./NameGenerator";

function generateSingleNameFromOptions(optionsFile: string): Promise<string> {
    logger.debug(`Options file argument: ${optionsFile}`);
    return generatorFromOptions(optionsFile)
        .then(generator => generator.generate());
}

function generatorFromOptions(optionsFile: string) {
    return loadOptions(optionsFile)
        .then(optionsAndPath => loadLinkedNameFiles(optionsAndPath))
        .then(options => new NameGenerator(options));
}

function loadLinkedNameFiles(optionsAndPath: [NameGeneratorOptions, string]) {
    const options = optionsAndPath[0];
    const optionsFilePath = path.dirname(optionsAndPath[1]);
    if (options.files) {
        let currentLinkLoadPromises = [];
        for (let placeholder in options.files) {
            for (let singleFilePath of options.files[placeholder]) {
                const namesForCurrentPlaceholderPromise = loadOptionsFromFile(path.join(optionsFilePath, singleFilePath))
                    .then(namesFromFile => {
                        const namesForPlaceholder = options[placeholder] as Array<string> || [];
                        const names = namesFromFile as Array<string>;
                        names.forEach(name => namesForPlaceholder.push(name));
                        options[placeholder] = namesForPlaceholder;
                    });
                currentLinkLoadPromises.push(namesForCurrentPlaceholderPromise);
            }
        }
        return Promise.all(currentLinkLoadPromises)
            .then(() => options);
    }
    return options;
}

function generateMultipleNamesFromOptions(optionsFile: string, amount: number): Promise<Array<string>> {
    logger.debug(`Options file argument: ${optionsFile}`);
    return generatorFromOptions(optionsFile)
        .then(generator => {
            const names = [] as Array<string>;
            for (let i = 0; i < amount; i++) {
                names.push(generator.generate());
            }
            return names;
        });
}

function loadOptions(optionsFile: string): Promise<[NameGeneratorOptions, string]> {
    if (optionsFile) {
        let optionsFilePath = path.join(process.cwd(), optionsFile);
        logger.debug('Loading options from %s', optionsFilePath);
        return loadOptionsFromFile(optionsFilePath)
            .then(options => [options, optionsFilePath] as [NameGeneratorOptions, string])
            .catch(error => {
                logger.error(`An error occured when reading options from file ${path}: `, error);
                logger.error('Replacing it with default options');
                return [DEFAULT_OPTIONS, process.cwd()];
            });
    } else {
        return Promise.resolve([DEFAULT_OPTIONS, process.cwd()]);
    }
}

function loadOptionsFromFile(pathToFile: string): Promise<NameGeneratorOptions> {
    return readFile(pathToFile).then(JSON.parse);
}

async function readFile(pathToFile: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(pathToFile, "utf8", (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

export {generateSingleNameFromOptions, generateMultipleNamesFromOptions};