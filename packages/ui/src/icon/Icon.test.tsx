import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Icon } from "./Icon";

describe("Icon", () => {
    it("draws the icon's token and is hidden from assistive technology without a label", () => {
        const { container } = render(<Icon name="edit" />);

        const icon = container.firstElementChild as HTMLElement;
        expect(icon.tagName).toBe("SPAN");
        expect(icon).toHaveClass("dextinityIcon");
        expect(icon).toHaveAttribute("data-icon", "edit");
        expect(icon).toHaveAttribute("aria-hidden", "true");
        expect(icon.style.getPropertyValue("--_icon")).toBe("var(--dextinity-icon-edit)");
    });

    it("is an image named by its label", () => {
        render(<Icon name="warning" label="Low stock" />);

        expect(screen.getByRole("img", { name: "Low stock" })).not.toHaveAttribute("aria-hidden");
    });

    it("adds the consumer's class and style", () => {
        const { container } = render(<Icon name="check" className="consumer" style={{ fontSize: 24 }} />);

        const icon = container.firstElementChild as HTMLElement;
        expect(icon).toHaveClass("dextinityIcon", "consumer");
        expect(icon).toHaveStyle({ fontSize: "24px" });
        expect(icon.style.getPropertyValue("--_icon")).toBe("var(--dextinity-icon-check)");
    });

    it("renders on the server", () => {
        expect(renderToStaticMarkup(<Icon name="home" />)).toContain('data-icon="home"');
    });
});
