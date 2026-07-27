import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { Theme } from "./Theme";

// Testing Library only registers its own cleanup when Vitest's globals are enabled, which they are not.
afterEach(cleanup);

describe("Theme render contract", () => {
    it("emits the root class", () => {
        render(<Theme>Themed</Theme>);

        expect(screen.getByText("Themed")).toHaveClass("cometTheme");
    });

    it("adds the consumer's class alongside the root class", () => {
        render(<Theme className="consumer">Themed</Theme>);

        expect(screen.getByText("Themed")).toHaveClass("cometTheme", "consumer");
    });

    it("emits the chosen color scheme as the scope attribute the token stylesheets select on", () => {
        render(<Theme colorScheme="dark">Themed</Theme>);

        expect(screen.getByText("Themed")).toHaveAttribute("data-comet-color-scheme", "dark");
    });

    it("emits the light color scheme when none is chosen", () => {
        render(<Theme>Themed</Theme>);

        expect(screen.getByText("Themed")).toHaveAttribute("data-comet-color-scheme", "light");
    });
});
