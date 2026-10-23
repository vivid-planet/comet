import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppBar } from "./AppBar";

describe("AppBar", () => {
    it("renders a banner with the styling contract", () => {
        render(<AppBar>Dextinity</AppBar>);

        const appBar = screen.getByRole("banner");
        expect(appBar.tagName).toBe("HEADER");
        expect(appBar).toHaveClass("dextinityAppBar");
        expect(appBar).toHaveTextContent("Dextinity");
    });

    it("adds the consumer's class, style and other props to the header", () => {
        render(
            <AppBar className="consumer" style={{ position: "sticky" }} aria-label="Application">
                Dextinity
            </AppBar>,
        );

        const appBar = screen.getByRole("banner", { name: "Application" });
        expect(appBar).toHaveClass("dextinityAppBar", "consumer");
        expect(appBar).toHaveStyle({ position: "sticky" });
    });
});
