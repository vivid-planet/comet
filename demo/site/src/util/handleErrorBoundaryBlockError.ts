import { ErrorInfo } from "react";

export function handleErrorBoundaryBlockError(error: Error, errorInfo: ErrorInfo): void {
    // Add your custom error handling here (for example, reporting to an error logging tool)

    // Throw error locally AND
    // when a ListBlock or OneOfBlock is not used inside a BlocksBlock, throw the error as well when there is no onError defined.
    if (process.env.NODE_ENV === "development") {
        console.error("Error", error, errorInfo);
        throw error;
    }
}
