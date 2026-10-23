import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Chip } from "./Chip";

describe("Chip", () => {
    it("renders the styling contract with the default owner state", () => {
        render(<Chip>Draft</Chip>);

        const chip = screen.getByText("Draft");
        expect(chip.tagName).toBe("SPAN");
        expect(chip).toHaveClass("dextinityChip");
        expect(chip).toHaveAttribute("data-tone", "neutral");
    });

    it("reflects the owner state in data attributes", () => {
        render(<Chip tone="success">Published</Chip>);

        expect(screen.getByText("Published")).toHaveAttribute("data-tone", "success");
    });

    it("adds the consumer's class to the contract class", () => {
        render(<Chip className="consumer">Draft</Chip>);

        expect(screen.getByText("Draft")).toHaveClass("dextinityChip", "consumer");
    });

    it("keeps the contract class and the owner state when render replaces the element", () => {
        render(
            <Chip tone="warning" render={<strong />}>
                Low stock
            </Chip>,
        );

        const chip = screen.getByText("Low stock");
        expect(chip.tagName).toBe("STRONG");
        expect(chip).toHaveClass("dextinityChip");
        expect(chip).toHaveAttribute("data-tone", "warning");
    });

    it("passes HTML attributes and the ref to the element", () => {
        const ref = createRef<HTMLElement>();
        render(
            <Chip title="Not published yet" ref={ref}>
                Draft
            </Chip>,
        );

        const chip = screen.getByText("Draft");
        expect(chip).toHaveAttribute("title", "Not published yet");
        expect(ref.current).toBe(chip);
    });
});
