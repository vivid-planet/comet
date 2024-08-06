import { ErrorInfo } from "react";

import { useErrorHandler } from "./ErrorHandlerProvider";

interface Props {
    error: Error;
    errorInfo: ErrorInfo;
}

export const ErrorReporter = ({ error, errorInfo }: Props) => {
    const { onError } = useErrorHandler();

    onError(error, errorInfo);

    return null;
};
