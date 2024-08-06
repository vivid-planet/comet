"use client";

import * as React from "react";

export const ErrorHandlerContext = React.createContext<{ onError: (error: Error) => void }>({
    onError: (error) => {
        if (process.env.NODE_ENV === "development") {
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
