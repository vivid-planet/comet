import { Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ExceptionContainerDetails, ExceptionContainerSummary } from "./ErrorBoundary.sc";

interface IErrorBoundaryProps {
    userErrorMessage?: string;
}

interface IErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
    }

    public render() {
        const { error, errorInfo } = this.state;
        if (errorInfo != null) {
            return (
                <Alert variant="filled" severity="error">
                    <Typography>
                        {this.props.userErrorMessage ? (
                            this.props.userErrorMessage
                        ) : (
                            <FormattedMessage id="comet.error.abstractErrorMessage" defaultMessage="An error has occurred" />
                        )}
                    </Typography>

                    {process.env.NODE_ENV === "development" && (
                        <ExceptionContainerDetails>
                            <ExceptionContainerSummary>Details</ExceptionContainerSummary>

                            <Typography>{error != null && error.toString()}</Typography>

                            <Typography>{errorInfo.componentStack}</Typography>
                        </ExceptionContainerDetails>
                    )}
                </Alert>
            );
        }
        return <>{this.props.children}</>;
    }
}
export { ErrorBoundary };
