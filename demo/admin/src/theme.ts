import { createCometTheme } from "@comet/admin-theme";
import type {} from "@mui/lab/themeAugmentation";
import { Theme } from "@mui/material";

export const theme = createCometTheme();

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}
