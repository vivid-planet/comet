import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

export type CometAdminFormSectionKeys = "root";

const useStyles = makeStyles<Theme, {}, CometAdminFormSectionKeys>(
    (theme: Theme) => ({
        root: {
            backgroundColor: theme.palette.grey[100],
            padding: "16px 16px 0 16px",
            margin: "0 -16px 16px -16px",
        },
    }),
    { name: "CometAdminFormSection" },
);

interface Props {
    children: React.ReactNode;
}

export function FormSection({ children }: Props): React.ReactElement {
    const classes = useStyles();
    return <div className={classes.root}>{children}</div>;
}
