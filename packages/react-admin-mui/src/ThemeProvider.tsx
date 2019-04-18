import { Theme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

interface IProps {
    theme: Theme;
    children: React.ReactNode;
}

export const MuiThemeProvider: React.FunctionComponent<IProps> = ({ theme, children }) => (
    <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeProvider>
);
