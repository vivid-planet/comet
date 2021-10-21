import { Theme } from "@material-ui/core";
import { createGenerateClassName, GenerateClassNameOptions, StylesProvider, ThemeProvider } from "@material-ui/styles";
// @ts-ignore nested is used only internally from Material UI, there are no types defined
import nested from "@material-ui/styles/ThemeProvider/nested";
import type { GenerateId } from "jss";
import * as React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

interface IProps {
    theme: Theme;
    children: React.ReactNode;
}

// Docs: https://v4.mui.com/styles/api/#creategenerateclassname-options-class-name-generator
// Code example: https://github.com/mui-org/material-ui/blob/v4.11.4/packages/material-ui-styles/src/createGenerateClassName/createGenerateClassName.js
function createGenerateCometClassName(options: GenerateClassNameOptions = {}): GenerateId {
    const { disableGlobal = false, seed = "" } = options;
    const seedPrefix = seed === "" ? "" : `${seed}-`;
    let ruleCounter = 0;

    const getNextCounterId = () => {
        ruleCounter += 1;
        if (process.env.NODE_ENV !== "production") {
            if (ruleCounter >= 1e10) {
                console.warn(["Comet Admin: You might have a memory leak.", "The ruleCounter is not supposed to grow that much."].join(""));
            }
        }
        return ruleCounter;
    };

    const muiGenerateClassName = createGenerateClassName(options);

    return (rule, styleSheet) => {
        const name = (styleSheet?.options as any).name;

        if (name && name.indexOf("Comet") === 0 && !styleSheet?.options.link && !disableGlobal) {
            const prefix = `${seedPrefix}${name}-${rule.key}`;

            if (!(styleSheet?.options as any).theme[nested] || seed !== "") {
                return prefix;
            }

            return `${prefix}-${getNextCounterId()}`;
        }

        return muiGenerateClassName(rule, styleSheet);
    };
}

export const MuiThemeProvider: React.FunctionComponent<IProps> = ({ theme, children }) => (
    <StylesProvider generateClassName={createGenerateCometClassName()}>
        <ThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <>{children}</>
            </StyledThemeProvider>
        </ThemeProvider>
    </StylesProvider>
);
