import { Paper, PaperProps } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";

export type CometAdminFormPaperKeys = "root";

const useStyles = makeStyles<Theme, {}, CometAdminFormPaperKeys>(
    ({ spacing }) => ({
        root: {
            padding: spacing(4),
        },
    }),
    { name: "CometAdminFormPaper" },
);

export function FormPaper({ classes: passedClasses, ...otherProps }: PaperProps & StyledComponentProps<CometAdminFormPaperKeys>): React.ReactElement {
    const classes = mergeClasses<CometAdminFormPaperKeys>(useStyles(), passedClasses);
    return <Paper classes={{ root: classes.root }} {...otherProps} />;
}
