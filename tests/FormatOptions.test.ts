import {
    ICsvFormatOptions, IFormatOptions, isCsvFormatOptions, isFormatOptions
} from "../src/common/FormatOptions";

const formatOptions: IFormatOptions = {
    attributes: [{ name: "name", type: "string" }],
};
const csvFormatOptions: ICsvFormatOptions = {
    attributes: [{ name: "name", type: "string" }],
    columnSeparator: ";",
    rowSeparator: "\n"
};

describe("Format Options", () => {
    it("should recognize FormatOptions", () => {
        expect(isFormatOptions(formatOptions)).toBe(true);
        expect(isCsvFormatOptions(formatOptions)).toBe(false);
    });

    it("should recognize CsvFormatOptions", () => {
        expect(isFormatOptions(csvFormatOptions)).toBe(true);
        expect(isCsvFormatOptions(csvFormatOptions)).toBe(true);
    });
});
