"use client";

import { createContext, type ErrorInfo, type PropsWithChildren, useContext } from "react";

interface Props {
    onError: (error: Error, errorInfo: ErrorInfo) => void;
}

const ErrorHandlerContext = createContext<Props>({
    onError: (error, errorInfo) => {
        if (process.env.NODE_ENV === "development") {
            console.error("Error caught by error handler", error, errorInfo.componentStack);
            throw error;
        } else {
            // Here the application should log the error to an error tracking service
        }
    },
});

export function ErrorHandlerProvider({ children, onError }: PropsWithChildren<Props>) {
    return <ErrorHandlerContext.Provider value={{ onError }}>{children}</ErrorHandlerContext.Provider>;
}

export const useErrorHandler = () => {
    return useContext(ErrorHandlerContext);
};
