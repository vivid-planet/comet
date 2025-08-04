// Inspired by https://testing-library.com/docs/react-testing-library/setup/#custom-render
import { createTheme } from "@mui/material";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { IntlProvider } from "react-intl";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { RouterMemoryRouter } from "../router/MemoryRouter";

const messages = {};
const theme = createTheme();

function DefaultWrapper({ children }: { children?: ReactNode }) {
    return (
        <IntlProvider locale="en" messages={messages}>
            <MuiThemeProvider theme={theme}>
                <RouterMemoryRouter>{children}</RouterMemoryRouter>
            </MuiThemeProvider>
        </IntlProvider>
    );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "queries">): RenderResult {
    return render(ui, { wrapper: DefaultWrapper, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
