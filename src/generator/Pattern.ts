import {randomInteger} from "./Random";
import logger from "../logger";
import {NameGeneratorOptions} from "./options";

class PlaceholderAndNames {
    readonly placeholder: string;
    readonly names: Array<string>;

    constructor(placeholder: string, names: Array<string>) {
        this.placeholder = placeholder;
        this.names = names;
    }

    getRandomName = () => {
        let namesAmount = this.names.length;
        if (namesAmount == 0) {
            return '';
        }
        const nameId = randomInteger(0, namesAmount-1);
        logger.debug(`Getting name for id ${nameId}`);
        return this.names[nameId];
    }
}

class Pattern {
    private static readonly PATTERN_PLACEHOLDER_REGEX = /{(\w+)}/g;
    readonly pattern: string;
    private readonly placeholdersAndNames: Array<PlaceholderAndNames> = [];

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    parse(options: NameGeneratorOptions) {
        let parsedPattern = this.parsePattern();
        logger.debug(`Parsed pattern ${this.pattern}: `, parsedPattern);
        parsedPattern.forEach(placeholder => {
            let names = options[placeholder] || [];
            let placeholderAndNames = new PlaceholderAndNames(placeholder, names);
            logger.debug('Created placeholder and names entity: ', placeholderAndNames);
            this.placeholdersAndNames.push(placeholderAndNames);
        });
    }

    private parsePattern(): Array<string> {
        const parsedPattern: Array<string> = [];
        let match;
        do {
            match = Pattern.PATTERN_PLACEHOLDER_REGEX.exec(this.pattern);
            if (match) {
                logger.debug(`Found match: ${match}`);
                parsedPattern.push(match[1]);
            }
        } while (match);
        return parsedPattern;
    }

    generate(): string {
        logger.debug(`Generating name for pattern ${this.pattern}`);
        let pattern: string = this.pattern;
        this.placeholdersAndNames.forEach(placeholderAndName => {
            pattern = pattern.replace(`{${placeholderAndName.placeholder}}`, placeholderAndName.getRandomName() as string);
        });
        return pattern;
    }
}

export {Pattern};