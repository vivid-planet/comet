"use client";

import { Component, type ErrorInfo, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    onError: (error: Error, errorInfo: ErrorInfo) => void;
}

type State = {
    hasError: boolean;
};

export class ErrorHandlerBoundaryInternal extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show nothing instead of the broken block
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error);

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    render() {
        if (this.state?.hasError) {
            return null;
        }

        return this.props.children;
    }
}
