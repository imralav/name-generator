import {Command, CommandResult} from "./Command";
import {NameGenerator} from "../../NameGenerator";
import {randomInteger} from "../../Random";
import logger from "../../../logger";

export class Generate implements Command {
    public static NAME = 'generate';
    public static FULL_SYNTAX = `generate <comma separated aliases> <amount> or generate <amount> for names from default alias`

    private amount: number;
    private generators: NameGenerator[];

    constructor(nameGeneratorForAliasFunction: (alias: string) => NameGenerator, amount: number, aliases= ['default'] as string[] ) {
        this.amount = amount;
        this.generators = aliases.map(alias => nameGeneratorForAliasFunction(alias));
    }

    run() {
        logger.info(`Generating ${this.amount} names:`);
        for (let i = 0; i < this.amount; i++) {
            logger.info(`${i+1} ${this.getRandomGenerator().generate()}`);
        }
        return Promise.resolve(CommandResult.SUCCESS);
    }

    private getRandomGenerator() : NameGenerator {
        const randomGeneratorIndex = randomInteger(0, this.generators.length - 1);
        return this.generators[randomGeneratorIndex];
    }
}