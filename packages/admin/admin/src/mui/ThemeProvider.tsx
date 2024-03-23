import { Theme } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import * as React from "react";

interface Props {
    theme: Theme;
    children: React.ReactNode;
}

export const MuiThemeProvider: React.FunctionComponent<Props> = ({ theme, children }) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <>{children}</>
        </ThemeProvider>
    </StyledEngineProvider>
);
