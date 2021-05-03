import { Paper, PaperProps } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

export type CometAdminFormPaperKeys = "root";

const useStyles = makeStyles<Theme, {}, CometAdminFormPaperKeys>(
    () => ({
        root: {
            padding: 16,
        },
    }),
    { name: "CometAdminFormPaper" },
);

export function FormPaper(props: PaperProps): React.ReactElement {
    const classes = useStyles();
    return <Paper classes={{ root: classes.root }} {...props} />;
}
