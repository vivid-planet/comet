import { ImporterEntityClass } from "../entities/base-target.entity";

export interface ParsingOptions {
    valueMapping?: ValueMapping;
    dateFormatString?: string;
}
export interface CsvColumnMetadata extends ParsingOptions {
    key: string;
    csvColumnName: string | number;
}
export interface ValueMapping {
    [key: string]: boolean | string;
}
const metadataKey = "csvColumns";
/**
 * Decorator to define a CSV column for an entity property. It defines the mapping between csv column and entity property.
 * @param {string} csvColumnName The name/header of the column in the csv file.
 * @param {ParsingOptions} parsingOptions - {@link ParsingOptions} Parsing options for the CSV column.
 * -------------------
 * *ParsingOptions:*
 * @property {{@link valueMapping}} valueMapping - A map defining boolean value representations
 * @property {string} dateFormatString - date-fns format string for parsing this column
 */
export const CsvColumn = (csvColumnName: string | number, parsingOptions: Partial<ParsingOptions> = {}) => {
    const { valueMapping, dateFormatString } = parsingOptions;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return function (target: any, key: string) {
        const csvColumns =
            Reflect.getOwnMetadata(metadataKey, target.constructor) || (Reflect.getMetadata(metadataKey, target.constructor) || []).slice(0);
        csvColumns.push({ key, csvColumnName, valueMapping, dateFormatString });
        Reflect.defineMetadata(metadataKey, csvColumns, target.constructor);
    };
};
export const getCsvColumns = (entity: ImporterEntityClass) => {
    return Reflect.getOwnMetadata(metadataKey, entity) as CsvColumnMetadata[];
};
