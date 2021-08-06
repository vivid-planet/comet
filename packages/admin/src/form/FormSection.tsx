import { makeStyles, Typography } from "@material-ui/core";
import { StyledComponentProps, Theme } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../helpers/mergeClasses";

export type CometAdminFormSectionKeys = "root" | "disableMarginBottom" | "title" | "children";

const useStyles = makeStyles<Theme, {}, CometAdminFormSectionKeys>(
    ({ spacing }) => ({
        root: {
            "&:not($disableMarginBottom)": {
                marginBottom: spacing(8),
            },
        },
        disableMarginBottom: {},
        title: {
            marginBottom: spacing(4),
        },
        children: {},
    }),
    { name: "CometAdminFormSection" },
);

export interface FormSectionProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    disableMarginBottom?: boolean;
}

export function FormSection({
    children,
    title,
    disableMarginBottom,
    classes: passedClasses,
}: FormSectionProps & StyledComponentProps<CometAdminFormSectionKeys>): React.ReactElement {
    const classes = mergeClasses<CometAdminFormSectionKeys>(useStyles(), passedClasses);
    const rootClasses: string[] = [classes.root];

    if (disableMarginBottom) {
        rootClasses.push(classes.disableMarginBottom);
    }

    return (
        <div className={rootClasses.join(" ")}>
            {title && <div className={classes.title}>{typeof title === "string" ? <Typography variant="h4">{title}</Typography> : title}</div>}
            <div className={classes.children}>{children}</div>
        </div>
    );
}
