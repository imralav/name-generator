import {NameGenerator} from "./NameGenerator";
import {NameGeneratorOptions} from "./options";

it('should throw an error when no pattern is specified', () => {
    expect(() => new NameGenerator({})).toThrow('No valid patterns found in provided options file');
});

describe('should always generate the same name if a single name is specified', () => {
    test('with a single pattern syntax', () => {
        const name = 'John';
        const optionsWithSingleName = {
            pattern: '{name}',
            name: [name]
        } as NameGeneratorOptions;
        const nameGenerator = new NameGenerator(optionsWithSingleName);
        for (let i = 0; i < 10; i++) {
            expect(nameGenerator.generate()).toEqual(name);
        }
    });
    test('with multiple patterns syntax', () => {
        const name = 'John';
        const optionsWithSingleName = {
            patterns: ['{name}'],
            name: [name]
        } as NameGeneratorOptions;
        const nameGenerator = new NameGenerator(optionsWithSingleName);
        for (let i = 0; i < 10; i++) {
            expect(nameGenerator.generate()).toEqual(name);
        }
    });
});

it('should return empty string if there are no names defined for the pattern', () => {
    const optionsWithSingleName = {
        pattern: '{name}'
    } as NameGeneratorOptions;
    const nameGenerator = new NameGenerator(optionsWithSingleName);
    for (let i = 0; i < 10; i++) {
        expect(nameGenerator.generate()).toEqual('');
    }
});
