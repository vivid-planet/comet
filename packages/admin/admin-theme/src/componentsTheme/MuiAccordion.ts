import { accordionDetailsClasses, accordionSummaryClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAccordion: GetMuiComponentTheme<"MuiAccordion"> = (component, { palette }) => ({
    ...component,
    defaultProps: {
        square: true,
        disableGutters: true,
        elevation: 0,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiAccordion">(component?.styleOverrides, {
        root: {
            border: `solid ${palette.divider}`,
            "&:not(:last-child)": {
                marginBottom: "20px",
            },
            "&:before": {
                display: "none",
            },
            [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
                transform: "rotate(90deg)",
            },
            [`& .${accordionSummaryClasses.root}`]: {
                display: "flex",
                flexDirection: "row-reverse",
                padding: "20px",
                gap: "20px",
                height: "86px",
            },
            [`& .${accordionDetailsClasses.root}`]: {
                borderTop: `solid ${palette.divider}`,
                padding: "40px",
            },
        },
    }),
});
