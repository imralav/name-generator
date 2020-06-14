import {Command, CommandResult} from "./Command";
import {loadInlineAndLinkedOptions} from "../../GeneratorOptionsLoader";
import {NameGeneratorOptions} from "../../options";

export class Load implements Command {
    public static NAME = 'load';
    public static FULL_SYNTAX = `${Load.NAME} <alias> <path> or ${Load.NAME} <path> for default alias`;
    private optionsConsumer: (_: NameGeneratorOptions) => void;
    private path: string;

    constructor(optionsConsumer: (_: NameGeneratorOptions) => void, path: string) {
        this.optionsConsumer = optionsConsumer;
        this.path = path;
    }

    run(): Promise<CommandResult> {
        return loadInlineAndLinkedOptions(this.path)
            .then(this.optionsConsumer)
            .then(() => CommandResult.SUCCESS)
            .catch(() => CommandResult.FAILURE);
    }
}