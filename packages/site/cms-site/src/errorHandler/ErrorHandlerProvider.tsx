"use client";

import * as React from "react";

interface Props {
    onError: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const ErrorHandlerContext = React.createContext<Props>({
    onError: (error, errorInfo) => {
        if (process.env.NODE_ENV === "development") {
            console.error("Error caught by error handler", error, errorInfo.componentStack);
            throw error;
        } else {
            // Here the application should log the error to an error tracking service
        }
    },
});

export function ErrorHandlerProvider({ children, onError }: React.PropsWithChildren<Props>) {
    return <ErrorHandlerContext.Provider value={{ onError }}>{children}</ErrorHandlerContext.Provider>;
}

export const useErrorHandler = () => {
    return React.useContext(ErrorHandlerContext);
};
