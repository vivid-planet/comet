// Inspired by https://testing-library.com/docs/react-testing-library/setup/#custom-render
import { createTheme } from "@mui/material";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { RouterMemoryRouter } from "../router/MemoryRouter";

const messages = {};
const theme = createTheme();

function DefaultWrapper({ children }: { children: React.ReactNode }) {
    return (
        <IntlProvider locale="en" messages={messages}>
            <MuiThemeProvider theme={theme}>
                <RouterMemoryRouter>{children}</RouterMemoryRouter>
            </MuiThemeProvider>
        </IntlProvider>
    );
}

function customRender(ui: React.ReactElement, options?: Omit<RenderOptions, "queries">): RenderResult {
    return render(ui, { wrapper: DefaultWrapper, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
