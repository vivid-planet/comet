import { type ValidationError } from "@nestjs/common";

import { CometException } from "./comet.exception";

export class CometValidationException extends CometException {
    constructor(
        message: string,
        readonly errors?: ValidationError[],
    ) {
        super(message);
    }
}
