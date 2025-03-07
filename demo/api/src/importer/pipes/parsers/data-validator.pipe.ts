import { LoggerService } from "@nestjs/common";
import { validate } from "class-validator";
import { Transform as StreamTransform, TransformCallback } from "stream";

import { ImporterPipe, ValidationError } from "../importer-pipe.type";

export class DataValidatorPipe implements ImporterPipe {
    getPipe(runLogger: LoggerService) {
        return new DataValidator(runLogger);
    }
}

type ParserPipeData = Record<string, string>;

export class DataValidator extends StreamTransform {
    constructor(private readonly logger: LoggerService) {
        super({ writableObjectMode: true, objectMode: true });
        this.logger = logger;
    }

    async _transform(instance: ParserPipeData, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const classValidationErrors = await validate(instance);
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
            this.push(instance);
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.logger.error(`Error transforming Data: ${err}`);
            this.emit("error", err);
            return callback(err);
        }

        callback();
    }
}
