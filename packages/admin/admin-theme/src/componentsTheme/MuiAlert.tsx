import { Check, Error, Info, Warning } from "@comet/admin-icons";
import React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAlert: GetMuiComponentTheme<"MuiAlert"> = (component, { palette, spacing }) => ({
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
        root: {},
        outlined: {
            backgroundColor: palette.background.paper,
            color: palette.grey[800],
            borderRadius: spacing(1),
            borderLeftWidth: spacing(1),
        },
        outlinedSuccess: {
            borderColor: palette.success.main,
        },
        outlinedInfo: {
            borderColor: palette.info.main,
        },
        outlinedWarning: {
            borderColor: palette.warning.main,
        },
        outlinedError: {
            borderColor: palette.error.main,
        },
        icon: {
            marginRight: 0,
            padding: 0,
        },
    }),
});
