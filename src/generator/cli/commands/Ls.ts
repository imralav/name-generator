import {Command, CommandResult} from "./Command";
import logger from "../../../logger";

export class Ls implements Command {
    public static NAME = 'ls';

    private aliases: Array<string>;

    constructor(aliases: Array<string>) {
        this.aliases = aliases;
    }

    run() {
        if (this.aliases.length == 0) {
            logger.info("No aliases available. Use 'load <alias> <path>' command.");
        } else {
            logger.info("Available aliases:");
            this.aliases.forEach(alias => {
                logger.info(alias);
            })
        }
        return Promise.resolve(CommandResult.SUCCESS);
    }
}