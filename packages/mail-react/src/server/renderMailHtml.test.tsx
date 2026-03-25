import { MjmlColumn, MjmlText } from "@faire/mjml-react";
import { describe, expect, it } from "vitest";

import { MjmlMailRoot } from "../components/mailRoot/MjmlMailRoot.js";
import { MjmlSection } from "../components/section/MjmlSection.js";
import { renderMailHtml } from "./renderMailHtml.js";

describe("server/renderMailHtml", () => {
    it("produces HTML with a doctype", () => {
        const { html } = renderMailHtml(
            <MjmlMailRoot>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>Hello</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(html.toLowerCase()).toMatch(/^<!doctype html>/);
    });

    it("includes the passed-in text content", () => {
        const textContent = "Welcome to @comet/mail-react";

        const { html } = renderMailHtml(
            <MjmlMailRoot>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>{textContent}</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(html).toContain(textContent);
    });

    it("produces no MJML warnings for a valid component tree", () => {
        const { mjmlWarnings } = renderMailHtml(
            <MjmlMailRoot>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlText>No warnings expected</MjmlText>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(mjmlWarnings).toEqual([]);
    });
});
