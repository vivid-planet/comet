import React, { ErrorInfo, PropsWithChildren } from "react";

type Props = {
    onError: (error: Error, errorInfo: ErrorInfo) => void;
};

type State = {
    hasError: boolean;
};

export class ErrorBoundary extends React.Component<PropsWithChildren<Props>, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show nothing instead of the broken block
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.onError(error, errorInfo);

        if (process.env.NODE_ENV === "development") {
            console.error("Error", error, errorInfo);
            throw new Error(error.message);
        }
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}
