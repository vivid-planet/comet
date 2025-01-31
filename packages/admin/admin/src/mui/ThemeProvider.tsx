import { type Theme } from "@mui/material";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { type PropsWithChildren } from "react";

interface Props {
    theme: Theme;
}

export const MuiThemeProvider = ({ theme, children }: PropsWithChildren<Props>) => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
);
