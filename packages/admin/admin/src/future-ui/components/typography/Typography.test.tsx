import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { Typography } from "./Typography";

// Testing Library only registers its own cleanup when Vitest's globals are enabled, which they are not.
afterEach(cleanup);

describe("Typography render contract", () => {
    it("emits the root class", () => {
        render(<Typography>Text</Typography>);

        expect(screen.getByText("Text")).toHaveClass("cometTypography");
    });

    it("adds the consumer's class alongside the root class", () => {
        render(<Typography className="consumer">Text</Typography>);

        expect(screen.getByText("Text")).toHaveClass("cometTypography", "consumer");
    });

    it("emits the default variant as a data attribute", () => {
        render(<Typography>Text</Typography>);

        expect(screen.getByText("Text")).toHaveAttribute("data-variant", "body");
    });

    it("emits the variant as a data attribute on a custom root element", () => {
        render(
            <Typography variant="headline" render={<label />}>
                Text
            </Typography>,
        );

        expect(screen.getByText("Text")).toHaveAttribute("data-variant", "headline");
    });

    it("renders the element the variant defaults to", () => {
        render(
            <>
                <Typography variant="headline">Headline</Typography>
                <Typography variant="body">Body</Typography>
            </>,
        );

        expect(screen.getByText("Headline").tagName).toBe("H2");
        expect(screen.getByText("Body").tagName).toBe("P");
    });

    it("renders the element given in `element` instead of the variant's default", () => {
        render(<Typography element="span">Text</Typography>);

        expect(screen.getByText("Text").tagName).toBe("SPAN");
    });

    it("renders the element given in `render` instead of `element` and the variant's default", () => {
        render(
            <Typography element="span" render={<label />}>
                Text
            </Typography>,
        );

        expect(screen.getByText("Text").tagName).toBe("LABEL");
    });
});
