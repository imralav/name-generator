import {Command, CommandResult} from "./Command";
import logger from "../../../logger";

export class Help implements Command {
    public static NAME = 'help';
    run() {
        logger.info("load <alias> <path>, where alias is the name of the file loaded from specified path. To see a list of available aliases use 'ls' command.");
        logger.info("ls, shows a list of available Name Generator aliases");
        logger.info("generate <alias> <amount>, alias is the name of a file given in 'load' command.");
        logger.info("exit leaves the app");
        return Promise.resolve(CommandResult.SUCCESS);
    }

    getFullSyntax(): string {
        return this.getSimpleName();
    }

    getSimpleName(): string {
        return Help.NAME;
    }
}