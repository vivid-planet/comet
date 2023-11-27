import { Check, Error, Info, Warning } from "@comet/admin-icons";
import React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAlert: GetMuiComponentTheme<"MuiAlert"> = (component, { palette }) => ({
    ...component,
    defaultProps: {
        variant: "outlined",

        iconMapping: {
            info: <Info color="info" />,
            success: <Check color="success" />,
            error: <Error color="error" />,
            warning: <Warning color="warning" />,
        },
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiAlert">(component?.styleOverrides, {
        root: {
            width: 400,
        },

        outlined: {
            borderLeftWidth: 5,
            backgroundColor: "#fff",
            borderRadius: 4,
            color: palette.grey[800],
        },
        outlinedSuccess: {
            borderColor: "#14CC33",
        },
        outlinedInfo: {
            borderColor: "#29B6F6",
        },
        outlinedWarning: {
            borderColor: "#FFB31A",
        },
        outlinedError: {
            borderColor: "#D11700",
        },
        icon: {
            marginRight: 0,
            padding: 0,
        },
    }),
});
