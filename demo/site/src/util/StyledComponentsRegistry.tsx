"use client";
import { theme } from "@src/theme";
import { useServerInsertedHTML } from "next/navigation";
import { PropsWithChildren, useState } from "react";
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";

export default function StyledComponentsRegistry({ children }: PropsWithChildren) {
    // Only create stylesheet once with lazy initial state
    // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement();
        styledComponentsStyleSheet.instance.clearTag();
        return <>{styles}</>;
    });

    if (typeof window !== "undefined") return <ThemeProvider theme={theme}>{children}</ThemeProvider>;

    return (
        <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyleSheetManager>
    );
}
