import * as csv from "@fast-csv/parse";
import { HeaderArray, ParserOptionsArgs } from "@fast-csv/parse";
import { CsvColumnMetadata } from "@src/importer/decorators/csv-column.decorator";

import { ImporterPipe } from "../importer-pipe.type";

export type ParserOptions = ParserOptionsArgs;

export class CsvParsePipe implements ImporterPipe {
    private readonly parserOptions: ParserOptions;

    constructor(parserOptions: ParserOptions, csvColumns: CsvColumnMetadata[]) {
        this.parserOptions = this.getParserOption(parserOptions, csvColumns);
    }

    getPipe() {
        return csv.parse(this.parserOptions);
    }

    private getParserOption(jobRunParserOptions: ParserOptions, csvColumns: CsvColumnMetadata[]) {
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
                    : (headers: HeaderArray) =>
                          headers.map((header) => {
                              if (!header) {
                                  return;
                              }

                              const csvColumn = csvColumns.find((column) => (column.csvColumnName as string).toLowerCase() === header.toLowerCase());

                              if (!csvColumn) {
                                  // There is no csvColumnName for this column. Will be ignored.
                                  return header;
                              }
                              return csvColumn.key;
                          }),
        };
    }
}
