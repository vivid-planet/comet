// @vitest-environment jsdom
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { IconBase } from "./IconBase.js";

function renderIcon(icon: ReactElement): SVGSVGElement {
    const { container } = render(icon);
    const renderedIcon = container.querySelector("svg");
    if (renderedIcon === null) {
        throw new Error("The icon did not render an <svg> element");
    }
    return renderedIcon;
}

describe("IconBase", () => {
    it("adds a consumer className next to the dextinityIcon class", () => {
        const icon = renderIcon(<IconBase className="toolbarIcon" />);

        expect(icon.classList).toContain("dextinityIcon");
        expect(icon.classList).toContain("toolbarIcon");
    });

    it("hides an icon without a label from assistive technology", () => {
        const icon = renderIcon(<IconBase />);

        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.getAttribute("role")).toBeNull();
    });

    it("exposes an icon with an aria-label as a labeled image", () => {
        const icon = renderIcon(<IconBase aria-label="Download" />);

        expect(icon.getAttribute("role")).toBe("img");
        expect(icon.getAttribute("aria-label")).toBe("Download");
        expect(icon.getAttribute("aria-hidden")).toBeNull();
    });
});
