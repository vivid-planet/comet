"use client";

import * as React from "react";

export const ErrorHandlerContext = React.createContext<{ onError: (error: Error, errorInfo: React.ErrorInfo) => void }>({
    onError: (error, errorInfo) => {
        if (process.env.NODE_ENV === "development") {
            console.error("Error caught by error handler", error, errorInfo.componentStack);
            throw error;
        } else {
            // Here the application should log the error to an error tracking service
        }
    },
});

export const ErrorHandlerProvider = ErrorHandlerContext.Provider;

export const useErrorHandler = () => {
    return React.useContext(ErrorHandlerContext);
};
