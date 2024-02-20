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

export type AlertClassKey = "root" | "message" | "title" | "text" | "action" | "closeIcon" | "hasTitle";

const styles = (theme: Theme) =>
    createStyles<AlertClassKey, AlertProps>({
        root: {
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow: theme.shadows[2],
            position: "relative",
            padding: theme.spacing(2, "12px", 2, 4),
            minHeight: 40, // to ensure consistent height for the content, regardless of the presence of a button or close icon, in order to set the outer padding correctly
        },
        message: {
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            padding: 0,
            paddingLeft: theme.spacing(2),
            marginBottom: 0,
        },
        title: {
            fontWeight: 600,
            marginBottom: theme.spacing(1),
        },
        text: {
            flexGrow: 1,
            marginRight: theme.spacing(4),
        },
        action: {},
        closeIcon: {},
        hasTitle: {
            alignItems: "flex-start",

            [`& .${buttonClasses.text}`]: {
                marginLeft: -15,
            },

            "& $action": {
                marginTop: theme.spacing(2),
            },

            "& $closeIcon": {
                position: "absolute",
                right: 10,
                top: 10,
            },
            "& $message": {
                flexDirection: "column",
                alignItems: "flex-start",
            },
            "&$root": {
                paddingBottom: "6px",
                paddingTop: theme.spacing(4),
            },
        },
    });

function Alert({ severity = "info", title, children, classes, onClose, action }: AlertProps & WithStyles<typeof styles>): React.ReactElement {
    return (
        <MuiAlert
            classes={{
                root: clsx(classes.root, Boolean(title) && classes.hasTitle),
                message: classes.message,
            }}
            severity={severity}
        >
            {Boolean(title) && <AlertTitle className={classes.title}>{title}</AlertTitle>}
            <Typography className={classes.text} variant="body2">
                {children}
            </Typography>
            <div className={classes.action}>{action}</div>
            {onClose && (
                <IconButton className={classes.closeIcon} onClick={onClose}>
                    <Close />
                </IconButton>
            )}
        </MuiAlert>
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
