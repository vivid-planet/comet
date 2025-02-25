import { ImporterEntityClass } from "../entities/base-target.entity";

export interface ParsingOptions {
    valueMapping?: ValueMapping;
    dateFormatString?: string;
}
export interface ImportFieldMetadata extends ParsingOptions {
    key: string;
    fieldPath: string;
    fieldName: string | number;
}
export interface ValueMapping {
    [key: string]: boolean | string;
}
const metadataKey = "fields";
/**
 * Decorator to define a CSV column for an entity property. It defines the mapping between csv column and entity property.
 * @param {string} fieldName The name/header of the column in the csv file.
 * @param {ParsingOptions} parsingOptions - {@link ParsingOptions} Parsing options for the CSV column.
 * -------------------
 * *ParsingOptions:*
 * @property {{@link valueMapping}} valueMapping - A map defining boolean value representations
 * @property {string} dateFormatString - date-fns format string for parsing this column
 */
export const CsvColumn = (fieldName: string | number, parsingOptions: Partial<ParsingOptions> = {}) => {
    const { valueMapping, dateFormatString } = parsingOptions;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return function (target: any, key: string) {
        const fields =
            Reflect.getOwnMetadata(metadataKey, target.constructor) || (Reflect.getMetadata(metadataKey, target.constructor) || []).slice(0);
        fields.push({ key, fieldPath: key, fieldName, valueMapping, dateFormatString });
        Reflect.defineMetadata(metadataKey, fields, target.constructor);
    };
};
export const getFields = (entity: ImporterEntityClass) => {
    return Reflect.getOwnMetadata(metadataKey, entity) as ImportFieldMetadata[];
};
