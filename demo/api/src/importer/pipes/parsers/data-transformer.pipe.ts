import { LoggerService } from "@nestjs/common";
import { ImporterInputClass } from "@src/importer/importer-input.type";
import { plainToInstance } from "class-transformer";
import { Transform as StreamTransform, TransformCallback } from "stream";

import { ImporterPipe, PipeData, PipeMetadata } from "../importer-pipe.type";

export class DataTransformerPipe implements ImporterPipe {
    constructor(private readonly inputClass: ImporterInputClass) {}

    getPipe(runLogger: LoggerService) {
        return new DataTransformer(runLogger, this.inputClass);
    }
}

export class DataTransformer extends StreamTransform {
    constructor(private readonly logger: LoggerService, private readonly inputClass: ImporterInputClass) {
        super({ writableObjectMode: true, objectMode: true });
        this.logger = logger;
    }

    async _transform(inputData: { data: PipeData; metadata: PipeMetadata }, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            const instance = plainToInstance(this.inputClass, inputData.data) as Record<string, unknown>;
            this.push({ data: instance, metadata: inputData.metadata });
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (err: any) {
            this.logger.error(`Error transforming Data: ${err}`);
            this.emit("error", err);
            return callback(err);
        }

        callback();
    }
}
