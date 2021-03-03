interface SubmitErrorProps<TSubmitError = unknown> {
    message?: string;
    submitError?: TSubmitError;
}

export class SubmitError<TSubmitError = unknown> extends Error {
    submitError?: TSubmitError;

    constructor(props?: SubmitErrorProps<TSubmitError>) {
        super(props?.message);
        this.submitError = props?.submitError;
    }
}

export interface SubmitResult<TSubmitError = unknown> {
    error?: SubmitError<TSubmitError>;
}
