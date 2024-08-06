"use client";

import React, { ErrorInfo, PropsWithChildren } from "react";

import { ErrorReporter } from "./ErrorReporter";

type State = {
    error?: Error;
    errorInfo?: ErrorInfo;
};

export class ErrorHandlerBoundary extends React.Component<PropsWithChildren, State> {
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state?.error && this.state?.errorInfo) {
            return <ErrorReporter error={this.state.error} errorInfo={this.state.errorInfo} />;
        }

        return this.props.children;
    }
}
