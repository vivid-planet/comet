import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Html from "./Html";

describe("Html", () => {
    it("renders an svg with the icon's viewBox", () => {
        const { container } = render(<Html />);
        const svg = container.querySelector("svg");

        expect(svg).not.toBeNull();
        expect(svg?.getAttribute("viewBox")).toBe("0 0 16 16");
    });

    it("forwards SvgIcon props to the svg element", () => {
        const { container } = render(<Html className="custom-class" data-testid="html-icon" />);
        const svg = container.querySelector("svg");

        expect(svg?.classList.contains("custom-class")).toBe(true);
        expect(svg?.getAttribute("data-testid")).toBe("html-icon");
    });

    it("renders a title when titleAccess is set", () => {
        const { container } = render(<Html titleAccess="HTML" />);
        const svg = container.querySelector("svg");

        expect(svg?.querySelector("title")?.textContent).toBe("HTML");
        expect(svg?.getAttribute("aria-hidden")).toBeNull();
    });

    it("hides the icon from assistive technology when no titleAccess is set", () => {
        const { container } = render(<Html />);

        expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    });
});
