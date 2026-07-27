import { MjmlStyle } from "@faire/mjml-react";
import type { ReactNode } from "react";

import { useTheme } from "../theme/ThemeProvider.js";
import { getRegisteredStyles } from "./registerStyles.js";

/**
 * Internal component that iterates the styles registry and renders one
 * `<MjmlStyle>` element per entry.
 */
export function Styles(): ReactNode {
    const theme = useTheme();
    const entries = Array.from(getRegisteredStyles().values());

    return (
        <>
            {entries.map((entry, index) => {
                const cssString = typeof entry.styles === "function" ? entry.styles(theme) : entry.styles;
                return (
                    <MjmlStyle key={index} {...entry.mjmlStyleProps}>
                        {cssString}
                    </MjmlStyle>
                );
            })}
        </>
    );
}
