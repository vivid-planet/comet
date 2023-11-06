import { ArrowRight, Check, Close, Error, Info, Warning } from "@comet/admin-icons";
import { Box, Button, Container, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export interface AdminComponentAlertsProps {
    severity?: "info" | "warning" | "error" | "success";
    startIcon?: React.ReactNode;
    title?: React.ReactNode;
    text: React.ReactNode;
    hideCloseButton?: boolean;
    onCloseClick?: () => void;
}

export type AdminComponentAlertsClassKey =
    | "root"
    | "content"
    | "severityInfo"
    | "severityWarning"
    | "severityError"
    | "severitySuccess"
    | "title"
    | "text"
    | "button"
    | "container"
    | "closeIconFull"
    | "marginBottom"
    | "paddingLeft"
    | "cursorPointer";

const styles = (theme: Theme) =>
    createStyles<AdminComponentAlertsClassKey, AdminComponentAlertsProps>({
        root: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            width: 400,
            padding: 20,
            display: "flex",
            boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.10)",
            position: "relative",
        },
        content: {},
        title: {
            fontWeight: "bold",
        },
        text: {
            fontWeight: 300,
            fontSize: 14,
            whiteSpace: "nowrap",
        },
        button: {
            paddingLeft: 0,
        },
        container: {
            display: "flex",
            alignItems: "center",
        },
        closeIconFull: {
            position: "absolute",
            right: 10,
            top: 10,
        },
        marginBottom: {
            marginBottom: 10,
        },
        cursorPointer: {
            cursor: "pointer",
        },
        paddingLeft: {
            paddingLeft: 180,
            paddingRight: 10,
        },
        severityInfo: {
            border: `1px solid ${theme.palette.primary.main}`,
            borderLeft: `5px solid ${theme.palette.primary.main}`,
        },
        severityWarning: {
            border: `1px solid ${theme.palette.warning.main}`,
            borderLeft: `5px solid ${theme.palette.warning.main}`,
        },
        severityError: {
            border: `1px solid #D11700`,
            borderLeft: `5px solid #D11700`,
        },
        severitySuccess: {
            border: `1px solid ${theme.palette.secondary.main}`,
            borderLeft: `5px solid ${theme.palette.secondary.main}`,
        },
    });

function AdminComponentAlerts({
    severity = "info",
    startIcon,
    title,
    text,
    classes,
    hideCloseButton = false,
    onCloseClick,
}: AdminComponentAlertsProps & WithStyles<typeof styles>): React.ReactElement {
    return (
        <Box
            className={clsx(
                classes.root,
                !title && classes.container,
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

            <Container className={clsx(!title && classes.container)}>
                <Typography variant="h6" className={classes.title}>
                    {title}
                </Typography>
                <Typography className={classes.text}>{text}</Typography>
                <Button variant="text" startIcon={<ArrowRight />} className={clsx(classes.button, !title && classes.paddingLeft)}>
                    <FormattedMessage id="comet.adminComponents.Alerts.ButtonAction" defaultMessage="Undo" />
                </Button>
                {!hideCloseButton && <Close className={clsx(classes.cursorPointer, title && classes.closeIconFull)} onClick={onCloseClick} />}
            </Container>
        </Box>
    );
}

const AdminComponentWithStyles = withStyles(styles, { name: "CometAdminAdminComponentAlerts" })(AdminComponentAlerts);

export { AdminComponentWithStyles as AdminComponentAlerts };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAdminComponentAlerts: AdminComponentAlertsProps;
    }

    interface ComponentNameToClassKey {
        CometAdminAdminComponentAlerts: AdminComponentAlertsClassKey;
    }

    interface Components {
        CometAdminAdminComponentAlerts?: {
            defaultProps?: ComponentsPropsList["CometAdminAdminComponentAlerts"];
            styleOverrides?: ComponentNameToClassKey["CometAdminAdminComponentAlerts"];
        };
    }
}
