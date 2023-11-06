import { ChevronDown, ChevronRight, Error } from "@comet/admin-icons";
import { Alert, AlertProps, ComponentsOverrides, Theme, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export type ErrorBoundaryClassKey =
    | "alert"
    | "message"
    | "exceptionDetails"
    | "exceptionSummary"
    | "exceptionSummaryIcon"
    | "exceptionSummaryIconOpened"
    | "exceptionSummaryIconClosed"
    | "exceptionSummaryTitle"
    | "exceptionStackTrace";

export type ErrorBoundaryProps = React.PropsWithChildren<{
    userErrorMessage?: React.ReactNode;
    variant?: AlertProps["variant"];
    icon?: AlertProps["icon"];
    toggleDetailsOpenedIcon?: React.ReactNode;
    toggleDetailsClosedIcon?: React.ReactNode;
    key?: string | number;
}>;

interface IErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps & WithStyles<ErrorBoundaryClassKey>, IErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps & WithStyles<ErrorBoundaryClassKey>) {
        super(props);
        this.state = {};
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
    }

    public render() {
        const {
            classes,
            variant = "filled",
            icon = <Error />,
            toggleDetailsOpenedIcon = <ChevronRight fontSize="small" />,
            toggleDetailsClosedIcon = <ChevronDown fontSize="small" />,
        } = this.props;
        const { error, errorInfo } = this.state;

        if (errorInfo != null) {
            return (
                <Alert variant={variant} icon={icon} severity="error" classes={{ root: classes.alert }}>
                    <Typography classes={{ root: classes.message }}>
                        {this.props.userErrorMessage ? (
                            this.props.userErrorMessage
                        ) : (
                            <FormattedMessage id="comet.error.abstractErrorMessage" defaultMessage="An error has occurred" />
                        )}
                    </Typography>

                    {process.env.NODE_ENV === "development" && (
                        <details className={classes.exceptionDetails}>
                            <summary className={classes.exceptionSummary}>
                                <div className={`${classes.exceptionSummaryIcon} ${classes.exceptionSummaryIconOpened}`}>
                                    {toggleDetailsOpenedIcon}
                                </div>
                                <div className={`${classes.exceptionSummaryIcon} ${classes.exceptionSummaryIconClosed}`}>
                                    {toggleDetailsClosedIcon}
                                </div>
                                <Typography classes={{ root: classes.exceptionSummaryTitle }}>{error != null && error.toString()}</Typography>
                            </summary>

                            <Typography classes={{ root: classes.exceptionStackTrace }}>{errorInfo.componentStack}</Typography>
                        </details>
                    )}
                </Alert>
            );
        }
        return <>{this.props.children}</>;
    }
}

const styles = (theme: Theme) =>
    createStyles<ErrorBoundaryClassKey, ErrorBoundaryProps>({
        alert: {},
        message: {},
        exceptionDetails: {
            whiteSpace: "pre-wrap",
            "&[open]": {
                "& $exceptionSummaryIconClosed": {
                    display: "flex",
                },
                "& $exceptionSummaryIconOpened": {
                    display: "none",
                },
            },
        },
        exceptionSummary: {
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            outline: "none",
            paddingTop: theme.spacing(2),
            "&:first-of-type ": {
                listStyleType: "none",
            },
        },
        exceptionSummaryIcon: {
            alignItems: "center",
        },
        exceptionSummaryIconOpened: {
            display: "flex",
        },
        exceptionSummaryIconClosed: {
            display: "none",
        },
        exceptionSummaryTitle: {
            fontWeight: theme.typography.fontWeightBold,
            paddingLeft: theme.spacing(1),
        },
        exceptionStackTrace: {},
    });

const StyledErrorBoundary = withStyles(styles, { name: "CometAdminErrorBoundary" })(ErrorBoundary);

export { StyledErrorBoundary as ErrorBoundary };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminErrorBoundary: ErrorBoundaryClassKey;
    }

    interface ComponentsPropsList {
        CometAdminErrorBoundary: Partial<ErrorBoundaryProps>;
    }

    interface Components {
        CometAdminErrorBoundary?: {
            defaultProps?: ComponentsPropsList["CometAdminErrorBoundary"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminErrorBoundary"];
        };
    }
}
