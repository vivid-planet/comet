import { MjmlRaw } from "@faire/mjml-react";
import clsx from "clsx";
import type { ReactNode } from "react";

import { createTheme } from "../../theme/createTheme.js";
import { ThemeProvider, useOptionalTheme } from "../../theme/ThemeProvider.js";
import type { DividerProps } from "./common.js";
import { HtmlDivider } from "./HtmlDivider.js";

export type MjmlDividerProps = DividerProps;

const themeFallback = createTheme();

/**
 * Themed divider for use inside an `MjmlColumn`.
 */
export function MjmlDivider({ variant, height, backgroundColor, backgroundImage, className, style }: MjmlDividerProps): ReactNode {
    const theme = useOptionalTheme();

    if (theme === null && variant !== undefined) {
        throw new Error("The `variant` prop requires being wrapped in a ThemeProvider or MjmlMailRoot.");
    }

    const activeVariant = variant ?? theme?.divider.defaultVariant;

    const divider = (
        <HtmlDivider
            variant={variant}
            height={height}
            backgroundColor={backgroundColor}
            backgroundImage={backgroundImage}
            className={clsx("mjmlDivider", activeVariant && `mjmlDivider--${activeVariant}`, className)}
            style={style}
        />
    );

    return <MjmlRaw>{theme === null ? <ThemeProvider theme={themeFallback}>{divider}</ThemeProvider> : divider}</MjmlRaw>;
}
