import { LoggerService } from "@nestjs/common";
import { CsvColumnMetadata } from "@src/importer/decorators/csv-column.decorator";
import { FieldTransformerData } from "@src/importer/decorators/field-transformer.decorator";
import { ImporterEntityClass } from "@src/importer/entities/base-target.entity";
import {
    columnIsBoolean,
    columnIsDate,
    columnIsFloat,
    columnIsInteger,
    isNullable,
    TargetEntityProperties,
    TargetEntityProperty,
} from "@src/importer/entities/target-entity.utils";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { parse, parseISO } from "date-fns";
import { Transform, TransformCallback } from "stream";

import { ImporterPipe, PipeData, ValidationError } from "../importer-pipe.type";

type ValidateAndTransformValueProperties = {
    value: string;
    propertyMetadata: TargetEntityProperty;
    field: CsvColumnMetadata;
};

type DataTransformOptions = {
    fields: CsvColumnMetadata[];
    targetEntityProperties: TargetEntityProperties;
    entityDateFormatString?: string;
    fieldTransformers?: FieldTransformerData[];
};

type PossibleValueTypes = string | number | boolean | Date | undefined | null;

export class CsvDataTransformerPipe implements ImporterPipe {
    constructor(private readonly options: DataTransformOptions, private readonly entity: ImporterEntityClass) {
        this.options = options;
    }

    getPipe(logger: LoggerService) {
        return new CsvDataTransformer(this.options, logger, this.entity);
    }
}

type ParserPipeData = Record<string, string>;

export class CsvDataTransformer extends Transform {
    constructor(
        private readonly options: DataTransformOptions,
        private readonly logger: LoggerService,
        private readonly entity: ImporterEntityClass,
    ) {
        super({ writableObjectMode: true, objectMode: true });
    }

    async _transform(inputData: ParserPipeData, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const transformedDataAndMetadata = this.transformData(inputData);
            const { data, errors } = await this.convertToInstanceAndValidate(transformedDataAndMetadata);
            if (errors.length) {
                console.log("DEBUG errors: ", errors);
            }
            this.push(data);
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.logger.error(`Error parsing Data: ${err}`);
            this.emit("error", err);
            return callback(null, err);
        }

        callback();
    }

    async convertToInstanceAndValidate(data: PipeData): Promise<{ data: PipeData; errors: ValidationError[] }> {
        const instance = plainToInstance(this.entity, data) as PipeData;
        const classValidationErrors = await validate(instance);
        const validationErrors = classValidationErrors.map((error) => {
            const constraints = error.constraints || {};
            const errorMessage = Object.keys(constraints)
                .map((constraintKey) => constraints[constraintKey])
                .join(". ");
            return { ...error, errorMessage };
        });
        const errors = [...validationErrors];

        return { data: instance, errors };
    }

    transformData(inputData: ParserPipeData): PipeData {
        const { fieldTransformers, targetEntityProperties } = this.options;
        const outputData: Record<string, unknown> = {};
        const manualValidationErrors: ValidationError[] = [];

        for (const field of this.options.fields) {
            const propertyName = field.key;
            const propertyMetadata = targetEntityProperties[propertyName];
            let value: string = inputData[propertyName];

            if (value !== undefined) {
                if (fieldTransformers) {
                    const possibleFieldTransformer = fieldTransformers.find((parser) => parser.key === propertyName);
                    if (possibleFieldTransformer) {
                        value = possibleFieldTransformer.transformFieldCallback(value);
                    }
                }
                const { data, error } = this.validateAndTransformValue({ value, propertyMetadata, field });
                if (error) {
                    manualValidationErrors.push(error);
                }
                outputData[propertyName] = data;
            } else if (!isNullable(propertyMetadata)) {
                manualValidationErrors.push({
                    property: field.key,
                    name: `${field.csvColumnName}`.toUpperCase(),
                    errorMessage: "Non-nullable field is empty",
                    value,
                });
            }
        }

        return outputData;
        // return { data: outputData, metadata: { ...inputData.metadata } }; //, errors: manualValidationErrors } };
    }

    validateAndTransformValue({ value, propertyMetadata, field }: ValidateAndTransformValueProperties): {
        data?: PossibleValueTypes;
        error?: ValidationError;
    } {
        let transformedValue: PossibleValueTypes = value;
        const valueMappingHasEmptyString =
            field.valueMapping &&
            Object.keys(field.valueMapping).find((key: string) => {
                return key === "";
            }) !== undefined;
        // Skip empty values if valueMapping contains a value for an empty string key for CSV
        if (transformedValue === "" && !valueMappingHasEmptyString) {
            if (isNullable(propertyMetadata)) {
                transformedValue = null;
            } else {
                return {
                    error: {
                        property: field.key,
                        name: `${field.csvColumnName}`.toUpperCase(),
                        errorMessage: "Non-nullable field is empty",
                        value,
                    },
                };
            }
        } else if (columnIsBoolean(propertyMetadata) && field.valueMapping) {
            transformedValue = field.valueMapping[value];
        } else if (columnIsInteger(propertyMetadata)) {
            transformedValue = parseInt(value);
            if (isNaN(transformedValue)) {
                return {
                    error: {
                        property: field.key,
                        name: `${field.csvColumnName}`.toUpperCase(),
                        errorMessage: "Integer field is NaN",
                        value,
                    },
                };
            }
        } else if (columnIsFloat(propertyMetadata)) {
            transformedValue = parseFloat(transformedValue);
            if (isNaN(transformedValue)) {
                return {
                    error: {
                        property: field.key,
                        name: `${field.csvColumnName}`.toUpperCase(),
                        errorMessage: "Float field is NaN",
                        value,
                    },
                };
            }
        } else if (columnIsDate(propertyMetadata)) {
            let date: Date;
            if (field.dateFormatString) {
                date = parse(transformedValue, field.dateFormatString, new Date());
            } else if (this.options.entityDateFormatString) {
                date = parse(transformedValue, this.options.entityDateFormatString, new Date());
            } else {
                date = parseISO(transformedValue);
            }
            if (!(date instanceof Date && !isNaN(date.valueOf()))) {
                return {
                    error: {
                        property: field.key,
                        name: `${field.csvColumnName}`.toUpperCase(),
                        errorMessage: `Invalid Date: ${transformedValue}`,
                        value: transformedValue,
                    },
                };
            }
            transformedValue = date;
        }
        if (field.key === "soldCount") {
            console.log("DEBUG columnIsBoolean(propertyMetadata): ", columnIsBoolean(propertyMetadata));
            console.log("DEBUG value: ", value);
            console.log("DEBUG typeof value: ", typeof value);
            console.log("DEBUG propertyMetadata: ", propertyMetadata);
            console.log("DEBUG field: ", field);
            console.log("DEBUG transformedValue: ", transformedValue);
            console.log("DEBUG typeof transformedValue: ", typeof transformedValue);
        }
        return { data: transformedValue };
    }
}
