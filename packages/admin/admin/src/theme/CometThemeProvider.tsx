import type { ThemeOptions } from "@mui/material";
import { type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";

import { MuiThemeProvider } from "../mui/ThemeProvider";
import { createCometTheme } from "./createCometTheme";

type Props = {
    children: ReactNode;
    themeOptions?: ThemeOptions;
    themeArgs?: object[];
};

export function CometThemeProvider({ children, themeOptions, themeArgs }: Props) {
    const intl = useIntl();
    const theme = useMemo(() => createCometTheme(themeOptions, { intl, themeArgs }), [themeOptions, intl, themeArgs]);
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
