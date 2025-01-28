// Inspired by https://testing-library.com/docs/react-testing-library/setup/#custom-render
import { MuiThemeProvider, RouterMemoryRouter, SnackbarProvider } from "@comet/admin";
import { createTheme } from "@mui/material";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { IntlProvider } from "react-intl";

const messages = {};
const theme = createTheme();

function DefaultWrapper({ children }: { children?: ReactNode }) {
    return (
        <IntlProvider locale="en" messages={messages}>
            <MuiThemeProvider theme={theme}>
                <RouterMemoryRouter>
                    <SnackbarProvider>{children}</SnackbarProvider>
                </RouterMemoryRouter>
            </MuiThemeProvider>
        </IntlProvider>
    );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "queries">): RenderResult {
    return render(ui, { wrapper: DefaultWrapper, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
