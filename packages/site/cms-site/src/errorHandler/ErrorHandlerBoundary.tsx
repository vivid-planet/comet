"use client";

import React, { PropsWithChildren } from "react";

type Props = {
    onError?: (error: Error) => void;
};

type State = {
    hasError: boolean;
};

export class ErrorHandlerBoundary extends React.Component<PropsWithChildren<Props>, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show nothing instead of the broken block
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error(error);

        if (this.props.onError) {
            this.props.onError(error);
        }
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}
