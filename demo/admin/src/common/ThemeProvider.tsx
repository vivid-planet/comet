import { createCometTheme, MuiThemeProvider } from "@comet/admin";
import { type PropsWithChildren, useMemo } from "react";
import { useIntl } from "react-intl";

export function ThemeProvider({ children }: PropsWithChildren) {
    const intl = useIntl();
    const theme = useMemo(() => createCometTheme({}, { intl }), [intl]);

    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
