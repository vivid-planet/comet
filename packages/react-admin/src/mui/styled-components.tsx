import { Theme } from "@material-ui/core/styles/createMuiTheme";
import * as styledComponents from "styled-components";

const { default: styled, css, createGlobalStyle, keyframes, ThemeProvider } = styledComponents as styledComponents.ThemedStyledComponentsModule<
    Theme
>;

export { css, createGlobalStyle, keyframes, styled, ThemeProvider };
