interface SubmitErrorProps<TSubmitError extends Object> {
    message?: string;
    error: TSubmitError;
}

export class SubmitError<TSubmitError extends Object> implements SubmitErrorProps<TSubmitError> {
    message?: string;
    error: TSubmitError;

    constructor({ message, error }: SubmitErrorProps<TSubmitError>) {
        this.message = message;
        this.error = error;
    }
}
