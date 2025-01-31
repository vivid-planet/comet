import { type ValidationError } from "@nestjs/common";

import { CometValidationException } from "./validation.exception";

export function ValidationExceptionFactory(errors: ValidationError[]): CometValidationException {
    return new CometValidationException("Validation failed", errors);
}
