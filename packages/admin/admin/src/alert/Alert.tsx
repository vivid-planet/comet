import { Close } from "@comet/admin-icons";
// eslint-disable-next-line no-restricted-imports
import { Alert as MuiAlert, AlertTitle, buttonClasses, IconButton, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

export interface AlertProps {
    severity?: "info" | "warning" | "error" | "success";
    title?: React.ReactNode;
    children?: React.ReactNode;
    onClose?: () => void;
    action?: React.ReactNode;
}

export type AlertClassKey = "root" | "message" | "title" | "text" | "action" | "closeIcon" | "hasTitle" | "singleRow";

const styles = (theme: Theme) =>
    createStyles<AlertClassKey, AlertProps>({
        root: {
            padding: theme.spacing(4, "12px", 4, 4),
        },
        message: {
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
        },
        title: {},
        text: {
            flexGrow: 1,
        },
        action: {},
        closeIcon: {},
        hasTitle: {
            position: "relative",
            alignItems: "flex-start",
            padding: theme.spacing(4, 6, "8px", 3),

            [`& .${buttonClasses.text}`]: {
                marginLeft: -15,
            },

            "& $action": {
                marginTop: theme.spacing(2),
            },

            "& $closeIcon": {
                position: "absolute",
                right: 2,
                top: 2,
            },
            "& $message": {
                flexDirection: "column",
                alignItems: "flex-start",
            },
        },
        singleRow: {
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(2, "12px", 2, 4),
        },
    });

const Alert = React.forwardRef<HTMLDivElement, AlertProps & WithStyles<typeof styles>>(
    ({ severity = "info", title, children, classes, onClose, action }, ref) => {
        const singleRow = !title && (action || onClose);
        return (
            <MuiAlert
                ref={ref}
                classes={{
                    root: clsx(classes.root, Boolean(title) && classes.hasTitle, singleRow && classes.singleRow),
                    message: classes.message,
                }}
                severity={severity}
            >
                {Boolean(title) && <AlertTitle className={classes.title}>{title}</AlertTitle>}
                <Typography className={classes.text} variant="body2">
                    {children}
                </Typography>
                {action && <div className={classes.action}>{action}</div>}
                {onClose && (
                    <IconButton className={classes.closeIcon} onClick={onClose}>
                        <Close />
                    </IconButton>
                )}
            </MuiAlert>
        );
    },
);

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
