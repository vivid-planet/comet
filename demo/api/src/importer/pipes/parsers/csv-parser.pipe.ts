import * as csv from "@fast-csv/parse";
import { HeaderArray, ParserOptionsArgs } from "@fast-csv/parse";
import { ImportFieldMetadata } from "@src/importer/decorators/csv-column.decorator";

import { ImporterPipe } from "../importer-pipe.type";

export type ParserOptions = Omit<ParserOptionsArgs, "encoding"> & { encoding: BufferEncoding };

export class CsvParsePipe implements ImporterPipe {
    private readonly parserOptions: ParserOptions;

    constructor(parserOptions: ParserOptions, csvColumns: ImportFieldMetadata[]) {
        this.parserOptions = this.getParserOption(parserOptions, csvColumns);
    }

    getPipe() {
        return csv.parse(this.parserOptions);
    }

    private getParserOption(jobRunParserOptions: ParserOptions, csvColumns: ImportFieldMetadata[]) {
        //check entity metadata for csv headers
        const entityHasOnlyNumericCsvColumnNames = csvColumns.every((column) => typeof column.fieldPath === "number");
        const entityHasOnlyStringCsvColumnNames = csvColumns.every((column) => typeof column.fieldPath === "string");
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

                              const csvColumn = csvColumns.find((column) => (column.fieldName as string).toLowerCase() === header.toLowerCase());

                              if (!csvColumn) {
                                  // There is no csvColumnName for this column. Will be ignored.
                                  return header;
                              }
                              return csvColumn.key;
                          }),
        };
    }
}
