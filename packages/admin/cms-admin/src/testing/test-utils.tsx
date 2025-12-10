// Inspired by https://testing-library.com/docs/react-testing-library/setup/#custom-render
import { MuiThemeProvider, SnackbarProvider } from "@comet/admin";
import { createTheme } from "@mui/material";
// eslint-disable-next-line no-restricted-imports
import { render as testingLibraryRender, type RenderOptions, type RenderResult } from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";
import { IntlProvider } from "react-intl";

const messages = {};
const theme = createTheme();

function DefaultWrapper({ children }: { children?: ReactNode }) {
    return (
        <IntlProvider locale="en" messages={messages}>
            <MuiThemeProvider theme={theme}>
                <SnackbarProvider>{children}</SnackbarProvider>
            </MuiThemeProvider>
        </IntlProvider>
    );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "queries">): RenderResult {
    return testingLibraryRender(ui, { wrapper: DefaultWrapper, ...options });
}

// eslint-disable-next-line no-restricted-imports
export * from "@testing-library/react";
export { customRender as render };
