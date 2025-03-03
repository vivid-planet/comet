import { LoggerService } from "@nestjs/common";
import { ImportFieldMetadata } from "@src/importer/decorators/csv-column.decorator";
import { FieldTransformerData } from "@src/importer/decorators/field-transformer.decorator";
import { ImporterEntityClass } from "@src/importer/entities/base-import-target.entity";
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
import jp from "jsonpath";
import { Transform, TransformCallback } from "stream";

import { ImporterPipe, PipeData, ValidationError } from "../importer-pipe.type";

type ValidateAndTransformValueProperties = {
    value: string;
    propertyMetadata: TargetEntityProperty;
    field: ImportFieldMetadata;
};

type DataTransformOptions = {
    fields: ImportFieldMetadata[];
    targetEntityProperties: TargetEntityProperties;
    fieldTransformers?: FieldTransformerData[];
};
type PipeDataAndErrors = {
    data: PipeData;
    errors: ValidationError[];
};

type PossibleValueTypes = string | number | boolean | Date | undefined | null | object;

export class DataTransformerPipe implements ImporterPipe {
    private readonly options: DataTransformOptions;

    constructor(options: DataTransformOptions, private readonly entity: ImporterEntityClass) {
        this.options = options;
    }

    getPipe(runLogger: LoggerService) {
        return new DataTransformer(this.options, runLogger, this.entity);
    }
}

type ParserPipeData = Record<string, string>;

export class DataTransformer extends Transform {
    constructor(
        private readonly options: DataTransformOptions,
        private readonly logger: LoggerService,
        private readonly entity: ImporterEntityClass,
    ) {
        super({ writableObjectMode: true, objectMode: true });
        this.logger = logger;
        this.options = options;
    }

    async _transform(inputData: ParserPipeData, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const transformedDataAndErrors = this.transformData(inputData);
            if (transformedDataAndErrors.errors.length > 0) {
                transformedDataAndErrors.errors.forEach((error) => {
                    this.logger.error(`Transformation Error: ${JSON.stringify(error)}`);
                });
                this.push(null);
                return callback(new Error("Too many transformation errors"));
            }
            const { data, errors } = await this.convertToInstanceAndValidate(transformedDataAndErrors.data);
            if (errors.length > 0) {
                errors.forEach((error) => {
                    this.logger.error(`Validation Errors: ${JSON.stringify(error)}`);
                });
                this.push(null);
                return callback(new Error("Too many validation errors"));
            }
            this.push(data);
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.logger.error(`Error transforming Data: ${err}`);
            this.emit("error", err);
            return callback(err);
        }

        callback();
    }

    async convertToInstanceAndValidate(data: PipeData): Promise<PipeDataAndErrors> {
        const instance = plainToInstance(this.entity, data) as Record<string, unknown>;
        const classValidationErrors = await validate(instance);
        const errors = classValidationErrors.map((error) => {
            const constraints = error.constraints || {};
            const errorMessage = Object.keys(constraints)
                .map((constraintKey) => constraints[constraintKey])
                .join(". ");
            return { ...error, errorMessage };
        });

        return { data: instance, errors };
    }

    transformData(inputData: ParserPipeData): PipeDataAndErrors {
        const { fieldTransformers, targetEntityProperties } = this.options;
        const outputData: Record<string, unknown> = {};
        const manualValidationErrors: ValidationError[] = [];
        for (const field of this.options.fields) {
            const propertyName = field.key;
            const propertyMetadata = targetEntityProperties[propertyName];
            const fieldPath = field.fieldPath;

            const values = jp.query(inputData, fieldPath);
            let value: string = values.length > 0 ? values[0] : undefined;
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
                    name: `${field.fieldPath}`.toUpperCase(),
                    errorMessage: "Non-nullable field is empty",
                    value,
                });
            }
        }
        return { data: outputData, errors: manualValidationErrors };
    }

    validateAndTransformValue({ value, propertyMetadata, field }: ValidateAndTransformValueProperties): {
        data?: PossibleValueTypes;
        error?: ValidationError;
    } {
        let transformedValue: PossibleValueTypes = value;
        if (transformedValue === "") {
            if (isNullable(propertyMetadata)) {
                transformedValue = null;
            } else {
                return {
                    error: {
                        property: field.key,
                        name: `${field.fieldPath}`.toUpperCase(),
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
                        name: `${field.fieldPath}`.toUpperCase(),
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
                        name: `${field.fieldPath}`.toUpperCase(),
                        errorMessage: "Float field is NaN",
                        value,
                    },
                };
            }
        } else if (columnIsDate(propertyMetadata)) {
            let date: Date;
            if (field.dateFormatString) {
                date = parse(transformedValue, field.dateFormatString, new Date());
            } else {
                date = parseISO(transformedValue);
            }
            if (!(date instanceof Date && !isNaN(date.valueOf()))) {
                return {
                    error: {
                        property: field.key,
                        name: `${field.fieldPath}`.toUpperCase(),
                        errorMessage: `Invalid Date: ${transformedValue}`,
                        value: transformedValue,
                    },
                };
            }
            transformedValue = date;
        }
        return { data: transformedValue };
    }
}
