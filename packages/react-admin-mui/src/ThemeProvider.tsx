import { Theme } from "@material-ui/core";
import { createMuiTheme as createOriginalMuiTheme, ThemeOptions } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

// tslint:disable:interface-name
declare module "@material-ui/core/styles/createMuiTheme" {
    interface Theme {
        rte: {
            colors: {
                border: React.CSSProperties["color"];
                toolbarBackground: React.CSSProperties["color"];
                buttonIcon: React.CSSProperties["color"];
                buttonIconDisabled: React.CSSProperties["color"];
                buttonBackgroundHover: React.CSSProperties["color"];
                buttonBorderHover: React.CSSProperties["color"];
                buttonBorderDisabled: React.CSSProperties["color"];
            };
        };
    }
    interface ThemeOptions {
        rte?: {
            colors?: {
                border?: React.CSSProperties["color"];
                toolbarBackground?: React.CSSProperties["color"];
                buttonIcon?: React.CSSProperties["color"];
                buttonIconDisabled?: React.CSSProperties["color"];
                buttonBackgroundHover?: React.CSSProperties["color"];
                buttonBorderHover?: React.CSSProperties["color"];
                buttonBorderDisabled?: React.CSSProperties["color"];
            };
        };
    }
}
// tslint:enable:interface-name

export const createMuiTheme = ({ rte, ...otherOptions }: ThemeOptions): Theme => {
    const defaultTheme = createOriginalMuiTheme(otherOptions);
    return createOriginalMuiTheme({
        rte: {
            colors: {
                border: rte?.colors?.border ? rte.colors.border : defaultTheme.palette.grey[400],
                toolbarBackground: rte?.colors?.toolbarBackground ? rte.colors.toolbarBackground : defaultTheme.palette.grey[100],
                buttonIcon: rte?.colors?.buttonIcon ? rte.colors.buttonIcon : defaultTheme.palette.grey[600],
                buttonIconDisabled: defaultTheme.palette.grey[300],
                buttonBackgroundHover: rte?.colors?.buttonBackgroundHover ? rte.colors.buttonBackgroundHover : defaultTheme.palette.grey[200],
                buttonBorderHover: rte?.colors?.buttonBorderHover ? rte.colors.buttonBorderHover : defaultTheme.palette.grey[400],
                buttonBorderDisabled: rte?.colors?.buttonBorderDisabled ? rte.colors.buttonBorderDisabled : defaultTheme.palette.grey[100],
            },
        },
        ...otherOptions,
    });
};

interface IProps {
    theme: Theme;
    children: React.ReactNode;
}

export const MuiThemeProvider: React.FunctionComponent<IProps> = ({ theme, children }) => (
    <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
            <>{children}</>
        </StyledThemeProvider>
    </ThemeProvider>
);
