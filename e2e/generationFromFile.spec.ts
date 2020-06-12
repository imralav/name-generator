import {generateMultipleNamesFromOptions, generateSingleNameFromOptions} from "../src/generator/GeneratorOptionsLoader";

it('should throw error when loading an empty file', () => {
    expect.assertions(1);
    return expect(generateSingleNameFromOptions('e2e/resources/empty.json')).rejects.toEqual(new Error('No valid patterns found in provided options file'));
});

describe('when generating a single name', () => {
    it('should handle a file with single pattern', () => {
        expect.assertions(1);
        return expect(generateSingleNameFromOptions('e2e/resources/single_pattern_with_names.json')).resolves.toEqual('Roman');
    });
    it('should handle a file with multiple patterns', () => {
        expect.assertions(1);
        return expect(generateSingleNameFromOptions('e2e/resources/multiple_patterns_with_names.json')).resolves.toEqual('Roman');
    });
});

describe('when generating multiple names', () => {
    it('should handle a file with single pattern', () => {
        expect.assertions(1);
        return expect(generateMultipleNamesFromOptions('e2e/resources/single_pattern_with_names.json', 2)).resolves.toEqual(['Roman', 'Roman']);
    });
    it('should handle a file with multiple patterns', () => {
        expect.assertions(1);
        return expect(generateMultipleNamesFromOptions('e2e/resources/multiple_patterns_with_names.json', 2)).resolves.toEqual(['Roman', 'Roman']);
    });
});

describe('when options file used links to other files', () => {
    it('should handle a link to a single file', () => {
        expect.assertions(1);
        return expect(generateSingleNameFromOptions('e2e/resources/single_linked_file.json')).resolves.toEqual('Roman');
    });
    it('should handle links to multiple files', () => {
        expect.assertions(1);
        return expect(generateSingleNameFromOptions('e2e/resources/multiple_linked_files.json')).resolves.toEqual('Roman');
    });
    it('should handle both links and inline names', () => {
        expect.assertions(1);
        return expect(generateSingleNameFromOptions('e2e/resources/linked_and_inline_names.json')).resolves.toEqual('Roman Nowak');
    });
});