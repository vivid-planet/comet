import { grey as greyPalette } from "@mui/material/colors";
import { type CSSProperties } from "react";

import { type RteProps } from "../Rte";

interface RteTheme {
    colors: {
        border: CSSProperties["color"];
        toolbarBackground: CSSProperties["color"];
        buttonIcon: CSSProperties["color"];
        buttonIconDisabled: CSSProperties["color"];
        buttonBackgroundHover: CSSProperties["color"];
        buttonBorderHover: CSSProperties["color"];
        buttonBorderDisabled: CSSProperties["color"];
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
