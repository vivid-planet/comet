import { makeStyles } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";

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

export function FormSection({ children, classes: passedClasses }: Props & StyledComponentProps<CometAdminFormSectionKeys>): React.ReactElement {
    const classes = mergeClasses<CometAdminFormSectionKeys>(useStyles(), passedClasses);
    return <div className={classes.root}>{children}</div>;
}
