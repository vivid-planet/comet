import { Theme } from "@mui/material";

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}
