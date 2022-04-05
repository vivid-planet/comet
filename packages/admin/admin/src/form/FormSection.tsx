import { ComponentsOverrides, Theme, Typography } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export type FormSectionClassKey = "root" | "disableMarginBottom" | "title" | "children";

export interface FormSectionProps {
    children: React.ReactNode;
    title?: React.ReactNode;
    disableMarginBottom?: boolean;
    disableTypography?: boolean;
}

const styles = ({ spacing }: Theme) => {
    return createStyles<FormSectionClassKey, any>({
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
    });
};

function Section({
    children,
    title,
    disableMarginBottom,
    disableTypography,
    classes,
}: FormSectionProps & WithStyles<typeof styles>): React.ReactElement {
    const rootClasses: string[] = [classes.root];

    if (disableMarginBottom) {
        rootClasses.push(classes.disableMarginBottom);
    }

    return (
        <div className={rootClasses.join(" ")}>
            {title && <div className={classes.title}>{disableTypography ? title : <Typography variant="h4">{title}</Typography>}</div>}
            <div className={classes.children}>{children}</div>
        </div>
    );
}

export const FormSection = withStyles(styles, { name: "CometAdminFormSection" })(Section);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFormSection: FormSectionClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFormSection: FormSectionProps;
    }

    interface Components {
        CometAdminFormSection?: {
            defaultProps?: ComponentsPropsList["CometAdminFormSection"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFormSection"];
        };
    }
}
