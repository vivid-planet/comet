import React, { ErrorInfo, PropsWithChildren } from "react";

type Props = {
    fallback: React.ReactNode;
    blockType: string;
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
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.onError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}
