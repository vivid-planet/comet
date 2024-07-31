"use client";

import * as React from "react";

export const ErrorHandlerContext = React.createContext<{ onError: (error: Error) => void }>({
    onError: () => {
        // empty default function
    },
});

export const ErrorHandlerProvider = ErrorHandlerContext.Provider;

export const useErrorHandler = () => {
    return React.useContext(ErrorHandlerContext);
};
