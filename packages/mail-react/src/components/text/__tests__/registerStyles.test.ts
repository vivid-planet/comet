// Import MjmlText module to trigger registerStyles side effect
import "../MjmlText.js";

import { describe, expect, it } from "vitest";

import { getRegisteredStyles } from "../../../styles/registerStyles.js";
import { createTheme } from "../../../theme/createTheme.js";
import type { Theme } from "../../../theme/themeTypes.js";

function getTextCss(theme: Theme): string {
    const entries = Array.from(getRegisteredStyles().values());
    return entries.map((entry) => (typeof entry.styles === "function" ? entry.styles(theme) : entry.styles)).join("\n");
}

describe("MjmlText registerStyles", () => {
    it("emits media query with !important for responsive variant values", () => {
        const theme = createTheme({
            text: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants: { heading: { fontSize: { default: "24px", mobile: "20px" } } } as any,
            },
        });
        const output = getTextCss(theme);

        expect(output).toContain("@media (max-width: 419px)");
        expect(output).toContain(".mjmlText--heading");
        expect(output).toContain("font-size: 20px !important");
    });

    it("emits bottomSpacing responsive override targeting compound selector", () => {
        const theme = createTheme({
            text: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants: { heading: { bottomSpacing: { default: 24, mobile: 16 } } } as any,
            },
        });
        const output = getTextCss(theme);

        expect(output).toContain(".mjmlText--bottomSpacing.mjmlText--heading");
        expect(output).toContain("padding-bottom: 16px !important");
    });

    it("produces no media queries for non-responsive variant values", () => {
        const theme = createTheme({
            text: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants: { heading: { fontSize: "24px" } } as any,
            },
        });
        const output = getTextCss(theme);

        expect(output).not.toContain("@media");
    });

    it("produces empty CSS when no variants are defined", () => {
        const theme = createTheme({ text: { fontSize: "16px" } });
        const output = getTextCss(theme);

        // The text registerStyles function returns empty when no variants
        // Other registered styles may still be present, so just check no mjmlText rules
        expect(output).not.toContain(".mjmlText--");
    });
});
