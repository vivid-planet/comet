import { type Decorator } from "@storybook/react";
import { MuiThemeProvider, createCometTheme } from "@comet/admin";

import { createTheme as createMuiTheme, GlobalStyles } from "@mui/material";
import { previewGlobalStyles } from "./ThemeProvider.styles";

export enum ThemeOptions  {
    Comet = "comet",
    Mui = "mui",
}
export const ThemeProviderDecorator: Decorator = (fn, context) => {
    const { theme : selectedTheme } = context.globals;
    const theme = selectedTheme === ThemeOptions.Mui ? createMuiTheme() : createCometTheme();
    return (
        <MuiThemeProvider theme={theme}>
            <GlobalStyles styles={previewGlobalStyles} />
            {fn()}
        </MuiThemeProvider>
    );
};
