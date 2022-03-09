export class SubmitError extends Error {
    submitError?: unknown;

    constructor(message?: string, submitError?: unknown) {
        super(message);
        this.submitError = submitError;
    }
}

export interface SubmitResult {
    error?: SubmitError;
}
