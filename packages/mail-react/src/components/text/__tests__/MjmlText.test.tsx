import { MjmlColumn } from "@faire/mjml-react";
import { describe, expect, it } from "vitest";

import { renderMailHtml } from "../../../server/renderMailHtml.js";
import { createTheme } from "../../../theme/createTheme.js";
import type { TextVariants } from "../../../theme/themeTypes.js";
import { MjmlMailRoot } from "../../mailRoot/MjmlMailRoot.js";
import { MjmlSection } from "../../section/MjmlSection.js";
import { MjmlText } from "../MjmlText.js";

describe("MjmlText integration", () => {
    it("renders base theme styles in output", () => {
        const { html, mjmlWarnings } = renderMailHtml(
            <MjmlMailRoot>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>Hello</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(html).toContain("font-size:16px");
        expect(html).toContain("line-height:20px");
        expect(mjmlWarnings).toEqual([]);
    });

    it("renders variant styles in output", () => {
        const theme = createTheme({
            text: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants: { heading: { fontSize: "24px", fontWeight: "700" } } as any,
            },
        });

        const { html, mjmlWarnings } = renderMailHtml(
            <MjmlMailRoot theme={theme}>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText variant={"heading" as keyof TextVariants}>Title</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(html).toContain("font-size:24px");
        expect(html).toContain("font-weight:700");
        expect(mjmlWarnings).toEqual([]);
    });

    it("includes responsive media queries in style block", () => {
        const theme = createTheme({
            text: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                variants: { heading: { fontSize: { default: "24px", mobile: "20px" } } } as any,
            },
        });

        const { html, mjmlWarnings } = renderMailHtml(
            <MjmlMailRoot theme={theme}>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText variant={"heading" as keyof TextVariants}>Title</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(html).toContain("@media");
        expect(html).toContain("font-size: 20px !important");
        expect(mjmlWarnings).toEqual([]);
    });

    it("produces no MJML warnings", () => {
        const { mjmlWarnings } = renderMailHtml(
            <MjmlMailRoot>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>No warnings</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(mjmlWarnings).toEqual([]);
    });
});
