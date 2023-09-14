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
            "& .MuiAccordionSummary-expandIconWrapper": {
                transform: "rotate(90deg)",
            },
            "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                transform: "rotate(-90deg)",
            },
            "& .MuiAccordionSummary-content": {
                marginLeft: 10,
            },
        },
    }),
});
