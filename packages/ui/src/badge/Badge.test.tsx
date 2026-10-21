import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders the styling contract with the default owner state", () => {
        render(<Badge>Draft</Badge>);

        const badge = screen.getByText("Draft");
        expect(badge.tagName).toBe("SPAN");
        expect(badge).toHaveClass("dextinityBadge");
        expect(badge).toHaveAttribute("data-tone", "neutral");
    });

    it("reflects the owner state in data attributes", () => {
        render(<Badge tone="success">Published</Badge>);

        expect(screen.getByText("Published")).toHaveAttribute("data-tone", "success");
    });

    it("adds the consumer's class to the contract class", () => {
        render(<Badge className="consumer">Draft</Badge>);

        expect(screen.getByText("Draft")).toHaveClass("dextinityBadge", "consumer");
    });

    it("keeps the contract class and the owner state when render replaces the element", () => {
        render(
            <Badge tone="warning" render={<strong />}>
                Low stock
            </Badge>,
        );

        const badge = screen.getByText("Low stock");
        expect(badge.tagName).toBe("STRONG");
        expect(badge).toHaveClass("dextinityBadge");
        expect(badge).toHaveAttribute("data-tone", "warning");
    });

    it("passes HTML attributes and the ref to the element", () => {
        const ref = createRef<HTMLElement>();
        render(
            <Badge title="Not published yet" ref={ref}>
                Draft
            </Badge>,
        );

        const badge = screen.getByText("Draft");
        expect(badge).toHaveAttribute("title", "Not published yet");
        expect(ref.current).toBe(badge);
    });
});
