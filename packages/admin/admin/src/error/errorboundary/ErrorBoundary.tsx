import { ChevronDown, ChevronRight, Error } from "@comet/admin-icons";
// eslint-disable-next-line no-restricted-imports
import { Alert as MuiAlert, AlertProps, ComponentsOverrides, Typography } from "@mui/material";
import { css, styled, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

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

type OwnerState = {
    showDetails?: boolean;
};

export type ErrorBoundaryProps = React.PropsWithChildren<{
    userErrorMessage?: React.ReactNode;
    variant?: AlertProps["variant"];
    icon?: AlertProps["icon"];
    toggleDetailsOpenedIcon?: React.ReactNode;
    toggleDetailsClosedIcon?: React.ReactNode;
    key?: string | number;
}> &
    ThemedComponentBaseProps<{
        alert: typeof MuiAlert;
        message: typeof Typography;
        exceptionDetails: "details";
        exceptionSummary: "summary";
        exceptionSummaryIconOpened: "div";
        exceptionSummaryIconClosed: "div";
        exceptionSummaryTitle: typeof Typography;
        exceptionStackTrace: typeof Typography;
    }>;

interface IErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
    showDetails?: boolean;
}

const Alert = styled(MuiAlert, {
    name: "CometAdminErrorBoundary",
    slot: "alert",
    overridesResolver(_, styles) {
        return [styles.alert];
    },
})();

const Message = styled(Typography, {
    name: "CometAdminErrorBoundary",
    slot: "message",
    overridesResolver(_, styles) {
        return [styles.message];
    },
})();

const ExceptionDetails = styled("details", {
    name: "CometAdminErrorBoundary",
    slot: "exceptionDetails",
    overridesResolver(_, styles) {
        return [styles.exceptionDetails];
    },
})(
    () => css`
        white-space: pre-wrap;
    `,
);

const ExceptionSummary = styled("summary", {
    name: "CometAdminErrorBoundary",
    slot: "exceptionSummary",
    overridesResolver(_, styles) {
        return [styles.exceptionSummary];
    },
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        cursor: pointer;
        outline: none;
        padding-top: ${theme.spacing(2)};

        &:first-of-type {
            list-style-type: none;
        }
    `,
);

const ExceptionSummaryIconOpen = styled("div", {
    name: "CometAdminErrorBoundary",
    slot: "exceptionSummaryIconOpened",
    overridesResolver(_, styles) {
        return [styles.exceptionSummaryIcon, styles.exceptionSummaryIconOpened];
    },
})<{ ownerState: OwnerState }>(
    ({ ownerState }) => css`
        align-items: center;
        display: flex;

        ${ownerState.showDetails &&
        css`
            display: none;
        `}
    `,
);

const ExceptionSummaryIconClosed = styled("div", {
    name: "CometAdminErrorBoundary",
    slot: "exceptionSummaryIconClosed",
    overridesResolver(_, styles) {
        return [styles.exceptionSummaryIcon, styles.exceptionSummaryIconClosed];
    },
})<{ ownerState: OwnerState }>(
    ({ ownerState }) => css`
        align-items: center;
        display: none;

        ${ownerState.showDetails &&
        css`
            display: flex;
        `}
    `,
);

const ExceptionSummaryTitle = styled(Typography, {
    name: "CometAdminErrorBoundary",
    slot: "exceptionSummaryTitle",
    overridesResolver(_, styles) {
        return [styles.exceptionSummaryTitle];
    },
})(
    ({ theme }) => css`
        font-weight: ${theme.typography.fontWeightBold};
        padding-left: ${theme.spacing(1)};
    `,
);

const ExceptionStackTrace = styled(Typography, {
    name: "CometAdminErrorBoundary",
    slot: "exceptionStackTrace",
    overridesResolver(_, styles) {
        return [styles.exceptionStackTrace];
    },
})();

export const ErrorBoundary = (inProps: ErrorBoundaryProps) => {
    const props = useThemeProps({ props: inProps, name: "CometAdminErrorBoundary" });
    return <CoreErrorBoundary {...props} />;
};

class CoreErrorBoundary extends React.Component<ErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState((prev) => ({ ...prev, error, errorInfo }));
    }

    public render() {
        const {
            variant = "filled",
            icon = <Error />,
            toggleDetailsOpenedIcon = <ChevronRight fontSize="small" />,
            toggleDetailsClosedIcon = <ChevronDown fontSize="small" />,
            children,
            slotProps,
            userErrorMessage,
            key,
            ...restProps
        } = this.props;
        const { error, errorInfo, showDetails } = this.state;

        const ownerState: OwnerState = {
            showDetails,
        };

        if (errorInfo != null) {
            return (
                <Alert variant={variant} icon={icon} severity="error" {...restProps} {...slotProps?.alert}>
                    <Message {...slotProps?.message}>
                        {userErrorMessage ? (
                            userErrorMessage
                        ) : (
                            <FormattedMessage id="comet.error.abstractErrorMessage" defaultMessage="An error has occurred" />
                        )}
                    </Message>

                    {process.env.NODE_ENV === "development" && (
                        <ExceptionDetails
                            onToggle={(e) => {
                                const showDetails = e.currentTarget.hasAttribute("open");
                                this.setState((prev) => ({ ...prev, showDetails }));
                            }}
                            {...slotProps?.exceptionDetails}
                        >
                            <ExceptionSummary {...slotProps?.exceptionSummary}>
                                <ExceptionSummaryIconOpen ownerState={ownerState} {...slotProps?.exceptionSummaryIconOpened}>
                                    {toggleDetailsOpenedIcon}
                                </ExceptionSummaryIconOpen>
                                <ExceptionSummaryIconClosed ownerState={ownerState} {...slotProps?.exceptionSummaryIconClosed}>
                                    {toggleDetailsClosedIcon}
                                </ExceptionSummaryIconClosed>
                                <ExceptionSummaryTitle {...slotProps?.exceptionSummaryTitle}>
                                    {error != null && error.toString()}
                                </ExceptionSummaryTitle>
                            </ExceptionSummary>
                            <ExceptionStackTrace {...slotProps?.exceptionStackTrace}>{errorInfo.componentStack}__</ExceptionStackTrace>
                        </ExceptionDetails>
                    )}
                </Alert>
            );
        }
        return <>{children}</>;
    }
}

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
