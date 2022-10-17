export class SubmitError extends Error {
    submitError?: any;

    constructor(message?: string, submitError?: any) {
        super(message);
        this.submitError = submitError;
    }
}

export interface SubmitResult {
    error?: SubmitError;
}
