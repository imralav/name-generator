import {NameGenerator} from "./NameGenerator";
import {NameGeneratorOptions} from "./options";

const DEFAULT_ALIAS : string = 'default';

class NameGeneratorManager {
    private generators: Record<string, NameGenerator> = {};

    public addForAlias(alias: string, generator: NameGenerator): void {
        this.generators[alias] = generator;
    }

    public addDefault(generator: NameGenerator): void {
        this.addForAlias(DEFAULT_ALIAS, generator);
    }

    public createAndAddForAlias(alias: string, options: NameGeneratorOptions): void {
        this.generators[alias] = new NameGenerator(options);
    }

    public createAndAddDefault(options: NameGeneratorOptions): void {
        this.createAndAddForAlias(DEFAULT_ALIAS, options);
    }

    public getAllAliases(): Array<string> {
        return Object.keys(this.generators);
    }

    public get(alias: string): NameGenerator {
        return this.generators[alias];
    }

    getDefault() {
        return this.get(DEFAULT_ALIAS);
    }
}

export {NameGeneratorManager};