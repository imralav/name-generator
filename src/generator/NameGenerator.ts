import logger from '../logger';
import {NameGeneratorOptions} from "./options";
import {randomInteger} from "./Random";
import {Pattern} from "./Pattern";

class NameGenerator {
    private readonly options: NameGeneratorOptions;
    private readonly patterns: Array<Pattern> = [];

    constructor(options: NameGeneratorOptions) {
        logger.info('Constructing name generator with options: ', options);
        this.options = options;
        this.collectPatterns();
        this.parse();
    }

    private collectPatterns() {
        if (this.options.pattern) {
            this.patterns.push(new Pattern(this.options.pattern));
        }
        if (this.options.patterns) {
            this.options.patterns.map(pattern => new Pattern(pattern)).forEach(pattern => this.patterns.push(pattern));
        }
        if (this.patterns.length == 0) {
            throw new Error('No valid patterns found in provided options file');
        }
    }

    parse() {
        logger.debug('Parsing options');
        this.patterns.forEach(pattern => pattern.parse(this.options));
    }

    generate() {
        let randomPattern : Pattern = this.getRandomPattern();
        logger.debug(`Generating name for pattern ${randomPattern.pattern}`);
        return randomPattern.generate();
    }

    getRandomPattern(): Pattern {
        const randomPatternIndex = randomInteger(0, this.patterns.length-1);
        return this.patterns[randomPatternIndex];
    }
}

export {NameGenerator};