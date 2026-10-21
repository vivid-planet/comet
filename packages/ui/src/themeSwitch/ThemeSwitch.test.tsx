import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ThemeSwitch } from "./ThemeSwitch";

describe("ThemeSwitch", () => {
    it("names its theme and color scheme on its element", () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark" data-testid="switch">
                Content
            </ThemeSwitch>,
        );

        const themeSwitch = screen.getByTestId("switch");
        expect(themeSwitch.tagName).toBe("DIV");
        expect(themeSwitch).toHaveClass("dextinityThemeSwitch");
        expect(themeSwitch).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(themeSwitch).toHaveAttribute("data-dextinity-color-scheme", "dark");
        expect(themeSwitch).toHaveTextContent("Content");
    });

    it("adds the consumer's class and passes the other props to its element", () => {
        render(
            <ThemeSwitch theme="acme" colorScheme="light" className="consumer" aria-label="Preview" style={{ padding: 8 }}>
                Content
            </ThemeSwitch>,
        );

        const themeSwitch = screen.getByLabelText("Preview");
        expect(themeSwitch).toHaveClass("dextinityThemeSwitch", "consumer");
        expect(themeSwitch).toHaveStyle({ padding: "8px" });
    });

    it("renders on the server with its theme in the markup", () => {
        const markup = renderToStaticMarkup(
            <ThemeSwitch theme="dextinity" colorScheme="dark">
                Content
            </ThemeSwitch>,
        );

        expect(markup).toContain('data-dextinity-theme="dextinity"');
        expect(markup).toContain('data-dextinity-color-scheme="dark"');
    });
});
