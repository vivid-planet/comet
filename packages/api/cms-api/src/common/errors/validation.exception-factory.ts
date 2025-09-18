import { type ValidationError } from "@nestjs/common";

import { CometValidationException } from "./validation.exception.js";

export function ValidationExceptionFactory(errors: ValidationError[]): CometValidationException {
    return new CometValidationException("Validation failed", errors);
}
