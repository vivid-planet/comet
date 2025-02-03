import * as csv from "@fast-csv/parse";
import { HeaderArray, ParserOptionsArgs } from "@fast-csv/parse";
import { CsvColumnMetadata } from "@src/importer/decorators/csv-column.decorator";

export type ParserOptions = Omit<ParserOptionsArgs, "encoding"> & { encoding: BufferEncoding };

export class CSVParseStream {
    private readonly parserOptions: ParserOptionsArgs;

    constructor(parserOptions: ParserOptionsArgs) {
        this.parserOptions = parserOptions;
    }

    getTransformStream() {
        return csv.parse(this.parserOptions);
    }

    static getParserOption(jobRunParserOptions: ParserOptions, csvColumns: CsvColumnMetadata[]) {
        //check entity metadata for csv headers
        const entityHasOnlyNumericCsvColumnNames = csvColumns.reduce((acc, column) => (typeof column.csvColumnName === "number" ? true : acc), false);
        const entityHasOnlyStringCsvColumnNames = csvColumns.reduce((acc, column) => (typeof column.csvColumnName === "string" ? true : acc), false);
        if (entityHasOnlyNumericCsvColumnNames && entityHasOnlyStringCsvColumnNames) {
            throw new Error(`Error importing: CSV column names must be either all property names or all indices`);
        }

        if (jobRunParserOptions?.headers && entityHasOnlyNumericCsvColumnNames) {
            throw new Error(`Error importing: Cannot use 'parserOptions.headers' when CSV column names are indices`);
        }

        return {
            delimiter: ";",
            quote: '"',
            trim: true,
            ...jobRunParserOptions,
            headers:
                jobRunParserOptions?.headers ?? entityHasOnlyNumericCsvColumnNames
                    ? undefined
                    : (headers: HeaderArray) => headers.map((header) => header?.toLowerCase()),
        };
    }
}
