import { Theme } from "@material-ui/core";
import greyPalette from "@material-ui/core/colors/grey";
import { createMuiTheme as createOriginalMuiTheme, ThemeOptions } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

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

export const createMuiTheme = ({ rte, ...otherOptions }: ThemeOptions): Theme => {
    return createOriginalMuiTheme({
        rte: {
            colors: {
                border: rte?.colors?.border ? rte.colors.border : greyPalette[400],
                toolbarBackground: rte?.colors?.toolbarBackground ? rte.colors.toolbarBackground : greyPalette[100],
                buttonIcon: rte?.colors?.buttonIcon ? rte.colors.buttonIcon : greyPalette[600],
                buttonIconDisabled: greyPalette[300],
                buttonBackgroundHover: rte?.colors?.buttonBackgroundHover ? rte.colors.buttonBackgroundHover : greyPalette[200],
                buttonBorderHover: rte?.colors?.buttonBorderHover ? rte.colors.buttonBorderHover : greyPalette[400],
                buttonBorderDisabled: rte?.colors?.buttonBorderDisabled ? rte.colors.buttonBorderDisabled : greyPalette[100],
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
