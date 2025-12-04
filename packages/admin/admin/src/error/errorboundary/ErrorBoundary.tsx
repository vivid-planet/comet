import { ChevronDown, ChevronRight, Error } from "@comet/admin-icons";
// eslint-disable-next-line no-restricted-imports
import { Alert as MuiAlert, type AlertProps, type ComponentsOverrides, Typography } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

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

export type ErrorBoundaryProps = PropsWithChildren<{
    userErrorMessage?: ReactNode;
    variant?: AlertProps["variant"];
    icon?: AlertProps["icon"];
    toggleDetailsOpenedIcon?: ReactNode;
    toggleDetailsClosedIcon?: ReactNode;
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
    errorInfo?: ErrorInfo;
    showDetails?: boolean;
}

const Alert = createComponentSlot(MuiAlert)<ErrorBoundaryClassKey>({
    componentName: "ErrorBoundary",
    slotName: "alert",
})();

const Message = createComponentSlot(Typography)<ErrorBoundaryClassKey>({
    componentName: "ErrorBoundary",
    slotName: "message",
})();

const ExceptionDetails = createComponentSlot("details")<ErrorBoundaryClassKey>({
    componentName: "ErrorBoundary",
    slotName: "exceptionDetails",
})(css`
    white-space: pre-wrap;
`);

const ExceptionSummary = createComponentSlot("summary")<ErrorBoundaryClassKey>({
    componentName: "ErrorBoundary",
    slotName: "exceptionSummary",
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

const ExceptionSummaryIconOpen = createComponentSlot("div")<ErrorBoundaryClassKey, OwnerState>({
    componentName: "ErrorBoundary",
    slotName: "exceptionSummaryIconOpened",
    classesResolver() {
        return ["exceptionSummaryIcon"];
    },
})(
    ({ ownerState }) => css`
        align-items: center;
        display: flex;

        ${ownerState.showDetails &&
        css`
            display: none;
        `}
    `,
);

const ExceptionSummaryIconClosed = createComponentSlot("div")<ErrorBoundaryClassKey, OwnerState>({
    componentName: "ErrorBoundary",
    slotName: "exceptionSummaryIconClosed",
    classesResolver() {
        return ["exceptionSummaryIcon"];
    },
})(
    ({ ownerState }) => css`
        align-items: center;
        display: none;

        ${ownerState.showDetails &&
        css`
            display: flex;
        `}
    `,
);

const ExceptionSummaryTitle = createComponentSlot(Typography)<ErrorBoundaryClassKey>({
    componentName: "ErrorBoundary",
    slotName: "exceptionSummaryTitle",
})(
    ({ theme }) => css`
        font-weight: ${theme.typography.fontWeightBold};
        padding-left: ${theme.spacing(1)};
    `,
);

const ExceptionStackTrace = createComponentSlot(Typography)<ErrorBoundaryClassKey>({
    componentName: "ErrorBoundary",
    slotName: "exceptionStackTrace",
})();

export const ErrorBoundary = (inProps: ErrorBoundaryProps) => {
    const props = useThemeProps({ props: inProps, name: "CometAdminErrorBoundary" });
    return <CoreErrorBoundary {...props} />;
};

class CoreErrorBoundary extends Component<ErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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
                            <ExceptionStackTrace {...slotProps?.exceptionStackTrace}>{errorInfo.componentStack}</ExceptionStackTrace>
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
        CometAdminErrorBoundary: ErrorBoundaryProps;
    }

    interface Components {
        CometAdminErrorBoundary?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminErrorBoundary"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminErrorBoundary"];
        };
    }
}
