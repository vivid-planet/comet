import { createCometTheme, MuiThemeProvider } from "@comet/admin";
import { createTheme as createMuiTheme, CssBaseline } from "@mui/material";
import { type Decorator } from "@storybook/react";

export enum ThemeOptions {
    Comet = "comet",
    Mui = "mui",
}

export const ThemeProviderDecorator: Decorator = (fn, context) => {
    const { theme: selectedTheme } = context.globals;
    const theme = selectedTheme === ThemeOptions.Mui ? createMuiTheme() : createCometTheme();
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {fn()}
        </MuiThemeProvider>
    );
};
