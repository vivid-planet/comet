import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { ComponentsOverrides, Theme } from "@mui/material";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails, { AccordionDetailsProps } from "@mui/material/AccordionDetails";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

interface FieldSetComponentsProps {
    root?: Partial<AccordionProps>;
    summary?: Partial<AccordionSummaryProps>;
    details?: Partial<AccordionDetailsProps>;
}
export interface FieldSetProps {
    title: React.ReactNode;
    supportText?: React.ReactNode;
    endAdornment?: React.ReactNode;
    collapsible?: boolean;
    initiallyExpanded?: boolean;
    disablePadding?: boolean;
    componentsProps?: FieldSetComponentsProps;
}

export type FieldSetClassKey =
    | "root"
    | "summary"
    | "headerColumn"
    | "title"
    | "supportText"
    | "endAdornment"
    | "placeholder"
    | "children"
    | "disablePadding";

const styles = (theme: Theme) =>
    createStyles<FieldSetClassKey, FieldSetProps>({
        root: {},
        summary: {
            display: "flex",
            flexDirection: "row-reverse",
            padding: "0 10px",
            height: "80px",
            [theme.breakpoints.up("sm")]: {
                padding: "0 20px",
            },
        },
        headerColumn: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignContent: "center",
            padding: "0px",
            [theme.breakpoints.up("sm")]: {
                padding: "10px",
            },
        },
        title: {
            display: "flex",
            alignItems: "center",
            fontWeight: theme.typography.fontWeightMedium,
            fontSize: "16px",
            textTransform: "uppercase",
            color: theme.palette.text.primary,
        },
        supportText: {
            fontSize: "12px",
            lineHeight: "18px",
            color: theme.palette.text.secondary,
        },
        endAdornment: { display: "flex", alignItems: "center" },
        placeholder: {
            flexGrow: 1,
            boxSizing: "inherit",
            userSelect: "none",
        },
        children: {
            display: "flex",
            flexDirection: "column",
            borderTop: `1px solid ${theme.palette.divider}`,
            padding: "20px",
            [theme.breakpoints.up("sm")]: {
                padding: "40px",
            },
            "&$disablePadding": {
                padding: "0px",
            },
        },
        disablePadding: {},
    });

function FieldSet({
    title,
    supportText,
    endAdornment,
    children,
    collapsible = true,
    initiallyExpanded = true,
    disablePadding = false,
    componentsProps,
    classes,
}: React.PropsWithChildren<FieldSetProps> & WithStyles<typeof styles>): React.ReactElement {
    const [expanded, setExpanded] = React.useState(initiallyExpanded);

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    return (
        <MuiAccordion
            expanded={expanded}
            onChange={
                collapsible
                    ? handleChange
                    : () => {
                          /* do nothing */
                      }
            }
            className={classes.root}
            {...componentsProps?.root}
        >
            <MuiAccordionSummary
                classes={{ root: classes.summary }}
                expandIcon={collapsible && <ArrowForwardIosSharpIcon />}
                {...componentsProps?.summary}
            >
                <div className={classes.headerColumn}>
                    <div className={classes.title}>{title}</div>
                    <div className={classes.supportText}>{supportText}</div>
                </div>
                <div className={classes.placeholder} />
                <div className={classes.endAdornment}>{endAdornment}</div>
            </MuiAccordionSummary>
            <MuiAccordionDetails className={clsx(classes.children, disablePadding && classes.disablePadding)} {...componentsProps?.details}>
                {children}
            </MuiAccordionDetails>
        </MuiAccordion>
    );
}

const FieldSetWithStyles = withStyles(styles, { name: "CometAdminFieldSet" })(FieldSet);

export { FieldSetWithStyles as FieldSet };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFieldSet: FieldSetProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFieldSet: FieldSetClassKey;
    }

    interface Components {
        CometAdminFieldSet?: {
            defaultProps?: ComponentsPropsList["CometAdminFieldSet"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFieldSet"];
        };
    }
}
