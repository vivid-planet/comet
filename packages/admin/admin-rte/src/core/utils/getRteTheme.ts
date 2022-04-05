import { grey as greyPalette } from "@mui/material/colors";
import * as React from "react";

import { RteProps } from "../Rte";

export interface RteTheme {
    colors: {
        border: React.CSSProperties["color"];
        toolbarBackground: React.CSSProperties["color"];
        buttonIcon: React.CSSProperties["color"];
        buttonIconDisabled: React.CSSProperties["color"];
        buttonBackgroundHover: React.CSSProperties["color"];
        buttonBorderHover: React.CSSProperties["color"];
        buttonBorderDisabled: React.CSSProperties["color"];
    };
}

export default (themeProps: Partial<RteProps> | undefined): RteTheme => {
    return {
        colors: {
            border: themeProps?.colors?.border ? themeProps.colors.border : greyPalette[400],
            toolbarBackground: themeProps?.colors?.toolbarBackground ? themeProps.colors.toolbarBackground : greyPalette[100],
            buttonIcon: themeProps?.colors?.buttonIcon ? themeProps.colors.buttonIcon : greyPalette[600],
            buttonIconDisabled: themeProps?.colors?.buttonIconDisabled ? themeProps.colors.buttonIconDisabled : greyPalette[300],
            buttonBackgroundHover: themeProps?.colors?.buttonBackgroundHover ? themeProps.colors.buttonBackgroundHover : greyPalette[200],
            buttonBorderHover: themeProps?.colors?.buttonBorderHover ? themeProps.colors.buttonBorderHover : greyPalette[400],
            buttonBorderDisabled: themeProps?.colors?.buttonBorderDisabled ? themeProps.colors.buttonBorderDisabled : greyPalette[100],
        },
    };
};
