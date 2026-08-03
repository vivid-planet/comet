import { describe, expect, it } from "vitest";

import { createTheme } from "../../../theme/createTheme.js";
import { generateRichTextListStyles } from "../RichTextList.js";

describe("generateRichTextListStyles", () => {
    it("restates a variant's breakpoint overrides on both cells, and its bottom spacing on the last row", () => {
        const theme = createTheme({
            text: {
                variants: { body: { fontSize: { default: "16px", mobile: "14px" }, bottomSpacing: { default: "16px", mobile: "12px" } } },
            },
        });
        const styles = generateRichTextListStyles(theme);

        expect(styles).toContain(".richTextBlock__list--variantBody .richTextBlock__listItemMarker");
        expect(styles).toContain(".richTextBlock__list--variantBody .richTextBlock__listItemText");
        expect(styles).toContain("font-size: 14px !important");
        expect(styles).toContain(".richTextBlock__list--variantBody .richTextBlock__listItem--blockSpacing > td");
        expect(styles).toContain("padding-bottom: 12px !important");
    });
});
