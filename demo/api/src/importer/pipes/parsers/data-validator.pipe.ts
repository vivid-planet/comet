import { LoggerService } from "@nestjs/common";
import { validate } from "class-validator";
import { Transform as StreamTransform, TransformCallback } from "stream";

import { ImporterPipe, PipeData, PipeMetadata, ValidationError } from "../importer-pipe.type";

export class DataValidatorPipe implements ImporterPipe {
    getPipe(runLogger: LoggerService) {
        return new DataValidator(runLogger);
    }
}

export class DataValidator extends StreamTransform {
    constructor(private readonly logger: LoggerService) {
        super({ writableObjectMode: true, objectMode: true });
        this.logger = logger;
    }

    async _transform(inputDataAndMetadata: { data: PipeData; metadata: PipeMetadata }, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const classValidationErrors = await validate(inputDataAndMetadata.data);
            const errors: ValidationError[] = classValidationErrors.map((error) => {
                const constraints = error.constraints || {};
                const errorMessage = Object.keys(constraints)
                    .map((constraintKey) => constraints[constraintKey])
                    .join(". ");
                return { ...error, errorMessage };
            });

            if (errors.length > 0) {
                errors.forEach((error) => {
                    this.logger.error(`Validation Errors: ${JSON.stringify(error)}`);
                });
                this.push(null);
                return callback(new Error("Too many validation errors"));
            }
            this.push(inputDataAndMetadata);
        } catch (error: unknown) {
            await this.logger.error(`Error validating Data: ${error}`);
            if (error instanceof Error) {
                callback(error);
            } else {
                callback(new Error(`An unknown error occurred: ${error}`));
            }
        }

        callback();
    }
}
