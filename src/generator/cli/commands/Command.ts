import logger from "../../../logger";

export interface Command {
    run(): Promise<CommandResult>;
}

export class Noop implements Command{
    run() {
        logger.debug('Noop command invoked');
        return Promise.resolve(CommandResult.SUCCESS);
    }
}

export enum CommandResult {
    SUCCESS, FAILURE
}