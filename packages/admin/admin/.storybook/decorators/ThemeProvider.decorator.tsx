import { createTheme as createMuiTheme, CssBaseline } from "@mui/material";
import type { Decorator } from "@storybook/react-vite";

import { MuiThemeProvider } from "../../src/mui/ThemeProvider";
import { createCometTheme } from "../../src/theme/createCometTheme";

export enum ThemeOption {
    Comet = "comet",
    Mui = "mui",
}

export const ThemeProviderDecorator: Decorator = (fn, context) => {
    const { theme: selectedTheme } = context.globals;
    const theme = selectedTheme === ThemeOption.Mui ? createMuiTheme() : createCometTheme();
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {fn()}
        </MuiThemeProvider>
    );
};
