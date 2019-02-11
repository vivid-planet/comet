import { Theme } from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

interface IProps {
    theme: Theme;
    children: React.ReactNode;
}
const ThemeProvider: React.FunctionComponent<IProps> = ({ theme, children }) => (
    <MuiThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </MuiThemeProvider>
);

export default ThemeProvider;
