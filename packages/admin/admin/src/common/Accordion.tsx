import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Theme } from "@mui/material";
import MuiAccordion, { AccordionProps as Props } from "@mui/material/Accordion";
import MuiAccordionDetails, { AccordionDetailsProps } from "@mui/material/AccordionDetails";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

interface AccordionComponentsProps {
    accordionSummary?: Partial<AccordionSummaryProps>;
    accordionDetails?: Partial<AccordionDetailsProps>;
}
export interface AccordionProps extends Omit<Partial<Props>, "title"> {
    title: React.ReactNode;
    supportText?: React.ReactNode;
    endAdornment?: React.ReactNode;
    initialExpanded?: boolean;
    componentsProps?: AccordionComponentsProps;
}

export type AccordionClassKey = "header" | "headerColumn" | "title" | "supportText" | "endAdornment" | "placeholder" | "children" | "isExpanded";

const styles = (theme: Theme) =>
    createStyles<AccordionClassKey, AccordionProps>({
        header: {
            display: "flex",
            flexDirection: "row-reverse",
            padding: "0 20px",
            gap: "20px",
            height: "86px",
        },
        headerColumn: {
            flexDirection: "column",
            padding: "20px",
        },
        title: {
            fontWeight: theme.typography.fontWeightMedium,
            fontSize: "14pt",
            textTransform: "uppercase",
            color: theme.palette.text.primary,
            "&$isExpanded": {
                color: theme.palette.primary.main,
            },
        },
        supportText: {
            fontSize: "10pt",
            lineHeight: "18px",
            color: theme.palette.text.secondary,
        },
        endAdornment: { alignItems: "center" },
        placeholder: {
            flexGrow: 1,
            boxSizing: "inherit",
            userSelect: "none",
        },
        children: {
            display: "flex",
            flexDirection: "column",
            borderTop: `solid ${theme.palette.divider}`,
            padding: "40px",
        },
        isExpanded: {},
    });

function Accordion({
    title,
    supportText,
    endAdornment,
    children,
    initialExpanded = false,
    componentsProps,
    classes,
}: AccordionProps & WithStyles<typeof styles>): React.ReactElement {
    const [expanded, setExpanded] = React.useState(initialExpanded);

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    return (
        <MuiAccordion expanded={expanded} onChange={handleChange}>
            <MuiAccordionSummary classes={{ root: classes.header }} expandIcon={<ArrowForwardIosSharpIcon />} {...componentsProps?.accordionSummary}>
                <div className={clsx(classes.headerColumn)}>
                    <div className={clsx(classes.title, expanded && classes.isExpanded)}>{title}</div>
                    <div className={clsx(classes.supportText)}>{supportText}</div>
                </div>
                <div className={clsx(classes.placeholder)} />
                <div className={clsx(classes.endAdornment)}>{endAdornment}</div>
            </MuiAccordionSummary>
            <MuiAccordionDetails classes={{ root: classes.children }} {...componentsProps?.accordionDetails}>
                {children}
            </MuiAccordionDetails>
        </MuiAccordion>
    );
}

const AccordionWithStyles = withStyles(styles, { name: "CometAdminAccordion" })(Accordion);

export { AccordionWithStyles as Accordion };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAccordion: AccordionProps;
    }

    interface ComponentNameToClassKey {
        CometAdminAccordion: AccordionClassKey;
    }

    interface Components {
        CometAdminAccordion?: {
            defaultProps?: ComponentsPropsList["CometAdminAccordion"];
            styleOverrides?: ComponentNameToClassKey["CometAdminAccordion"];
        };
    }
}
