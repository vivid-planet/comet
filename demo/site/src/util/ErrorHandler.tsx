"use client";

import { ErrorHandlerProvider } from "@comet/cms-site";
import { PropsWithChildren } from "react";

export function ErrorHandler({ children }: PropsWithChildren) {
    function onError(error: Error) {
        if (process.env.NODE_ENV === "development") {
            throw error;
        } else {
            // Log the error to an error tracking service
        }
    }

    return <ErrorHandlerProvider value={{ onError }}>{children}</ErrorHandlerProvider>;
}
