import {Command, CommandResult} from "./Command";

export class Exit implements Command {
    public static NAME = 'exit';
    private exitCliAction : Function;

    constructor(exitCliAction : Function) {
        this.exitCliAction = exitCliAction;
    }

    run() {
        this.exitCliAction();
        return Promise.resolve(CommandResult.SUCCESS);
    }
}