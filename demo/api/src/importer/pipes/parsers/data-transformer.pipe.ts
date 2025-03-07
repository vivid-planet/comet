import { LoggerService } from "@nestjs/common";
import { ImporterInputClass } from "@src/importer/importer-input.type";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Transform as StreamTransform, TransformCallback } from "stream";

import { ImporterPipe, PipeData, ValidationError } from "../importer-pipe.type";

type PipeDataAndErrors = {
    data: PipeData;
    errors: ValidationError[];
};

export class DataTransformerPipe implements ImporterPipe {
    constructor(private readonly inputClass: ImporterInputClass) {}

    getPipe(runLogger: LoggerService) {
        return new DataTransformer(runLogger, this.inputClass);
    }
}

type ParserPipeData = Record<string, string>;

export class DataTransformer extends StreamTransform {
    constructor(private readonly logger: LoggerService, private readonly inputClass: ImporterInputClass) {
        super({ writableObjectMode: true, objectMode: true });
        this.logger = logger;
    }

    async _transform(inputData: ParserPipeData, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const { data, errors } = await this.convertToInstanceAndValidate(inputData);

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
        const instance = plainToInstance(this.inputClass, data) as Record<string, unknown>;
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
}
