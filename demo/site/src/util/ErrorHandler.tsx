"use client";

<<<<<<< HEAD
import { ErrorHandlerProvider } from "@comet/cms-site";
import { type ErrorInfo, type PropsWithChildren } from "react";
=======
import { ErrorHandlerProvider } from "@comet/site-nextjs";
import { PropsWithChildren } from "react";
>>>>>>> main

export function ErrorHandler({ children }: PropsWithChildren) {
    function onError(error: Error, errorInfo: ErrorInfo) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error caught by error handler", error, errorInfo.componentStack);
            throw error;
        } else {
            // Log the error to an error tracking service
        }
    }

    return <ErrorHandlerProvider onError={onError}>{children}</ErrorHandlerProvider>;
}
