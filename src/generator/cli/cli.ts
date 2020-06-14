import inquirer from "inquirer";
import logger from "../../logger";
import {NameGeneratorManager} from "../NameGeneratorManager";
import {Command, CommandResult, Noop} from "./commands/Command";
import {Ls} from "./commands/Ls";
import {Exit} from "./commands/Exit";
import {Help} from "./commands/Help";
import {Generate} from "./commands/Generate";
import {Load} from "./commands/Load";

class Cli {
    private nameGeneratorManager: NameGeneratorManager;
    private continue: boolean;

    constructor() {
        this.nameGeneratorManager = new NameGeneratorManager();
        this.continue = true;
    }

    public handleMainMenu(): Promise<Command> {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'selectedCommand',
                message: 'What do you want to do? Type "help" to see available options',
                default: Help.NAME,
                choices: [
                    Help.NAME,
                    Load.NAME,
                    Ls.NAME,
                    Generate.NAME,
                    Exit.NAME
                ]
            }
        ])
            .then(answer => this.createCommandFromAnswer(answer))
            .catch(error => {
                logger.error(`An error occured: ${error}`);
                return new Noop();
            });
    }

    private createCommandFromAnswer(answer: { selectedCommand: string }): Command {
        const selectedCommand: string = answer.selectedCommand;
        const parsedSelectedCommand = selectedCommand.split(" ");
        if (parsedSelectedCommand.length === 0) {
            throw new Error('No command selected');
        } else {
            switch (parsedSelectedCommand[0]) {
                case Ls.NAME:
                    return new Ls(this.nameGeneratorManager.getAllAliases());
                case Exit.NAME:
                    return new Exit(() => this.markForExit());
                case Help.NAME:
                    return new Help();
                case Load.NAME:
                    return this.createLoadCommand(parsedSelectedCommand);
                case Generate.NAME:
                    return this.createGenerateCommand(parsedSelectedCommand);
                default:
                    throw new Error('Invalid command selected');
            }
        }
    }

    private createLoadCommand(parsedSelectedCommand: string[]): Load {
        if (parsedSelectedCommand.length >= 3) {
            const alias = parsedSelectedCommand[1];
            const path = parsedSelectedCommand[2];
            logger.info(`Loading options for alias ${alias} from path ${path}`);
            return new Load(options => this.nameGeneratorManager.createAndAddForAlias(alias, options), path);
        } else if (parsedSelectedCommand.length == 2) {
            const path = parsedSelectedCommand[1];
            logger.info(`Loading options for default alias from path ${path}`);
            return new Load(options => this.nameGeneratorManager.createAndAddDefault(options), path);
        } else {
            throw new Error(`${parsedSelectedCommand} is an incorrect command for ${Load.NAME}. Try ${Load.FULL_SYNTAX}`)
        }
    }

    private createGenerateCommand(parsedSelectedCommand: string[]): Generate {
        if (parsedSelectedCommand.length >= 3) {
            const aliases = parsedSelectedCommand[1].split(',');
            const amount = Number.parseInt(parsedSelectedCommand[2]);
            logger.info(`Generating ${amount} names for alias(es) ${aliases}`);
            return new Generate(alias => this.nameGeneratorManager.get(alias), amount, aliases);
        } else if (parsedSelectedCommand.length == 2) {
            const amount = Number.parseInt(parsedSelectedCommand[1]);
            logger.info(`Generating ${amount} names for default alias`);
            return new Generate(alias => this.nameGeneratorManager.getDefault(), amount);
        } else {
            throw new Error(`${parsedSelectedCommand} is an incorrect command for ${Generate.NAME}. Try ${Generate.FULL_SYNTAX}`)
        }
    }

    private markForExit(): void {
        this.continue = false;
    }

    public shouldContinue(): boolean {
        return this.continue;
    }
}

async function operateCli() {
    const cli = new Cli();
    let selectedCommand;
    while (cli.shouldContinue()) {
        selectedCommand = await cli.handleMainMenu();
        const commandResult = await selectedCommand.run();
        if (commandResult == CommandResult.SUCCESS) {
            logger.info(`Command finished successfully`);
        } else {
            logger.error('Command failed');
        }
    }
}

export {operateCli};