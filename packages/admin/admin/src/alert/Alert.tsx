import { Check, Close, Error, Info, Warning } from "@comet/admin-icons";
import { IconButton, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

export interface AlertProps {
    severity?: "info" | "warning" | "error" | "success";
    title?: React.ReactNode;
    children?: React.ReactNode;
    disableCloseButton?: boolean;
    onClose?: () => void;
    action?: React.ReactNode;
}

export type AlertClassKey =
    | "root"
    | "severityInfo"
    | "severityWarning"
    | "severityError"
    | "severitySuccess"
    | "title"
    | "text"
    | "button"
    | "container"
    | "closeIcon"
    | "hasTitle";

const styles = (theme: Theme) =>
    createStyles<AlertClassKey, AlertProps>({
        root: {
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            width: 400,
            padding: 20,
            boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.10)",
            position: "relative",
        },
        title: {
            fontWeight: 600,
        },
        text: {
            fontWeight: 300,
            fontSize: 14,
            whiteSpace: "nowrap",
            flexGrow: 1,
            marginRight: 20,
        },
        button: {},
        container: {
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            paddingLeft: theme.spacing(2),
        },
        closeIcon: {},
        severityInfo: {
            border: `1px solid #29B6F6`,
            borderLeft: `5px solid #29B6F6`,
        },
        severityWarning: {
            border: `1px solid #FFB31A`,
            borderLeft: `5px solid #FFB31A`,
        },
        severityError: {
            border: `1px solid #D11700`,
            borderLeft: `5px solid #D11700`,
        },
        severitySuccess: {
            border: `1px solid #14CC33`,
            borderLeft: `5px solid #14CC33`,
        },
        hasTitle: {
            alignItems: "flex-start",

            "& $button": {
                marginLeft: -15,
            },

            "& $closeIcon": {
                position: "absolute",
                right: 10,
                top: 10,
            },
            "& $container": {
                flexDirection: "column",
                alignItems: "flex-start",
            },
        },
    });

function Alert({
    severity = "info",
    title,
    children,
    classes,
    disableCloseButton = false,
    onClose,
    action,
}: AlertProps & WithStyles<typeof styles>): React.ReactElement {
    // const button: React.ReactNode = null;

    // if (action) {
    //     const { text: actionText, ...restActionProps } = action;
    //     button = (
    //         <Button variant="text" startIcon={<ArrowRight />} className={classes.button} {...restActionProps}>
    //             {actionText}
    //         </Button>
    //     );
    // }

    return (
        <div
            className={clsx(
                classes.root,
                Boolean(title) && classes.hasTitle,
                severity === "info" && classes.severityInfo,
                severity === "warning" && classes.severityWarning,
                severity === "error" && classes.severityError,
                severity === "success" && classes.severitySuccess,
            )}
        >
            {severity === "info" ? (
                <Info color={severity} />
            ) : severity === "warning" ? (
                <Warning color={severity} />
            ) : severity === "error" ? (
                <Error color={severity} />
            ) : severity === "success" ? (
                <Check color={severity} />
            ) : null}

            <div className={classes.container}>
                {Boolean(title) && (
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                )}
                {children}
                {action}
                {!disableCloseButton && (
                    <IconButton className={classes.closeIcon} onClick={onClose}>
                        <Close />
                    </IconButton>
                )}
            </div>
        </div>
    );
}

const AdminComponentWithStyles = withStyles(styles, { name: "CometAdminAlert" })(Alert);

export { AdminComponentWithStyles as Alert };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAlert: AlertProps;
    }

    interface ComponentNameToClassKey {
        CometAdminAlert: AlertClassKey;
    }

    interface Components {
        CometAdminAlert?: {
            defaultProps?: ComponentsPropsList["CometAdminAlert"];
            styleOverrides?: ComponentNameToClassKey["CometAdminAlert"];
        };
    }
}
