import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Typography, type TypographyVariant } from "./Typography";

describe("Typography", () => {
    it("renders the styling contract with the default owner state", () => {
        render(<Typography>Running text</Typography>);

        const text = screen.getByText("Running text");
        expect(text.tagName).toBe("P");
        expect(text).toHaveClass("dextinityTypography");
        expect(text).toHaveAttribute("data-variant", "body");
        expect(text).toHaveAttribute("data-tone", "default");
    });

    it("reflects the owner state in data attributes", () => {
        render(
            <Typography variant="bodySmall" tone="muted">
                Hint
            </Typography>,
        );

        const text = screen.getByText("Hint");
        expect(text).toHaveAttribute("data-variant", "bodySmall");
        expect(text).toHaveAttribute("data-tone", "muted");
    });

    it.each<[TypographyVariant, string]>([
        ["display", "H1"],
        ["heading1", "H1"],
        ["heading2", "H2"],
        ["heading3", "H3"],
        ["heading4", "H4"],
        ["bodyLarge", "P"],
        ["body", "P"],
        ["bodySmall", "P"],
        ["label", "SPAN"],
        ["overline", "SPAN"],
    ])("renders the %s variant as %s", (variant, tagName) => {
        render(<Typography variant={variant}>Text</Typography>);

        expect(screen.getByText("Text").tagName).toBe(tagName);
    });

    it("adds the consumer's class to the contract class", () => {
        render(<Typography className="consumer">Text</Typography>);

        expect(screen.getByText("Text")).toHaveClass("dextinityTypography", "consumer");
    });

    it("keeps the contract class and the owner state when render replaces the element", () => {
        render(
            <Typography variant="heading4" render={<h2 className="consumer" />}>
                Shipping address
            </Typography>,
        );

        const heading = screen.getByRole("heading", { level: 2, name: "Shipping address" });
        expect(heading).toHaveClass("dextinityTypography", "consumer");
        expect(heading).toHaveAttribute("data-variant", "heading4");
        expect(heading).toHaveAttribute("data-tone", "default");
    });

    it("passes the owner state to a render function", () => {
        render(
            <Typography variant="label" render={(props, ownerState) => <label {...props} title={ownerState.variant} />}>
                Email
            </Typography>,
        );

        const label = screen.getByText("Email");
        expect(label.tagName).toBe("LABEL");
        expect(label).toHaveClass("dextinityTypography");
        expect(label).toHaveAttribute("title", "label");
    });

    it("passes HTML attributes and the ref to the element", () => {
        const ref = createRef<HTMLElement>();
        render(
            <Typography id="intro" ref={ref}>
                Text
            </Typography>,
        );

        const text = screen.getByText("Text");
        expect(text).toHaveAttribute("id", "intro");
        expect(ref.current).toBe(text);
    });
});
