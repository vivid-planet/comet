import { cleanup, render, screen } from "test-utils";
import { afterEach, describe, expect, it } from "vitest";

import { Button } from "./Button";

// Testing Library only registers its own cleanup when Vitest's globals are enabled, which they are not.
afterEach(cleanup);

/**
 * Compile-time contract for slot-prop typing. Never rendered — it exists so
 * `tsc` fails if the typing regresses.
 */
export function ButtonSlotPropsTypeContract() {
    const icon = <span />;
    return (
        <>
            {/* The chosen element flows into slotProps: an anchor slot accepts `href`, no cast. */}
            <Button slots={{ startIcon: "a" }} slotProps={{ startIcon: { href: "/x" } }} startIcon={icon} />
            {/* Two slots infer their elements independently from one `slots` literal. */}
            <Button
                slots={{ startIcon: "a", endIcon: "button" }}
                slotProps={{ startIcon: { href: "/x" }, endIcon: { type: "submit" } }}
                startIcon={icon}
                endIcon={icon}
            />
            <Button
                slots={{ startIcon: "a" }}
                slotProps={{
                    // @ts-expect-error an anchor slot's href must be a string
                    startIcon: { href: 123 },
                }}
                startIcon={icon}
            />
            <Button
                slotProps={{
                    // @ts-expect-error the default span slot has no href
                    startIcon: { href: "/x" },
                }}
                startIcon={icon}
            />
        </>
    );
}

describe("Button render contract", () => {
    it("emits the root class", () => {
        render(<Button>Label</Button>);

        expect(screen.getByRole("button")).toHaveClass("cometButton");
    });

    it("adds the consumer's class alongside the root class", () => {
        render(<Button className="consumer">Label</Button>);

        expect(screen.getByRole("button")).toHaveClass("cometButton", "consumer");
    });

    it("emits the default variant as a data attribute", () => {
        render(<Button>Label</Button>);

        expect(screen.getByRole("button")).toHaveAttribute("data-variant", "primary");
    });

    it("emits the chosen variant as a data attribute", () => {
        render(<Button variant="secondary">Label</Button>);

        expect(screen.getByRole("button")).toHaveAttribute("data-variant", "secondary");
    });

    it("emits `data-disabled` without a value when disabled", () => {
        render(<Button disabled>Label</Button>);

        expect(screen.getByRole("button")).toHaveAttribute("data-disabled", "");
    });

    it("omits `data-disabled` when not disabled", () => {
        render(<Button>Label</Button>);

        expect(screen.getByRole("button")).not.toHaveAttribute("data-disabled");
    });

    it("sets the type that doesn't submit an enclosing form", () => {
        render(<Button>Label</Button>);

        expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("emits a part class on each icon", () => {
        render(
            <Button startIcon="start" endIcon="end">
                Label
            </Button>,
        );

        expect(screen.getByText("start")).toHaveClass("cometButton__startIcon");
        expect(screen.getByText("end")).toHaveClass("cometButton__endIcon");
    });
});

describe("Button slots", () => {
    it("renders a slot as the element chosen in `slots`, merging the contract class with consumer props", () => {
        render(
            <Button slots={{ startIcon: "a" }} slotProps={{ startIcon: { href: "/downloads", className: "consumer-class" } }} startIcon={<span />}>
                Download
            </Button>,
        );

        const startIcon = screen.getByRole("link");
        expect(startIcon.getAttribute("href")).toBe("/downloads");
        expect(startIcon).toHaveClass("cometButton__startIcon", "consumer-class");
    });
});
