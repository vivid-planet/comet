import { ErrorInfo } from "react";

export function handleErrorBoundaryBlockError(error: Error, errorInfo: ErrorInfo): void {
    // Add your custom error handling here (for example, reporting to an error logging tool)

    if (process.env.NODE_ENV === "development") {
        console.error("Error", error, errorInfo);
        throw error;
    }
}
