"use client";

import React, { PropsWithChildren } from "react";

import { ErrorReporter } from "./ErrorReporter";

type State = {
    error?: Error;
};

export class ErrorHandlerBoundary extends React.Component<PropsWithChildren, State> {
    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show nothing instead of the broken block
        return { error };
    }

    render() {
        if (this.state?.error) {
            return <ErrorReporter error={this.state.error} />;
        }

        return this.props.children;
    }
}
