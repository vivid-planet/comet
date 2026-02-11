/**
 * Generates error handling code for form submissions.
 * Creates errors.reduce() implementation that maps GraphQL errors to Final Form submission errors.
 */
export function generateErrorHandlingCode({
    mutationResponsePath,
    errorMessagesVariable,
}: {
    mutationResponsePath: string;
    errorMessagesVariable: string;
}): string {
    return `
    if (${mutationResponsePath}.errors.length) {
        return ${mutationResponsePath}.errors.reduce(
            (submissionErrors, error) => {
                const errorMessage = ${errorMessagesVariable}[error.code];
                if (error.field) {
                    submissionErrors[error.field] = errorMessage;
                } else {
                    submissionErrors[FORM_ERROR] = errorMessage;
                }
                return submissionErrors;
            },
            {} as Record<string, ReactNode>,
        );
    }`;
}
