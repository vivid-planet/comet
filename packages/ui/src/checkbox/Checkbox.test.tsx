import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
    it("renders the styling contract around a control labelled by its children", () => {
        render(<Checkbox defaultChecked>Subscribe to the newsletter</Checkbox>);

        const control = screen.getByRole("checkbox", { name: "Subscribe to the newsletter" });
        const root = control.closest("label");
        const indicator = control.querySelector(".dextinityCheckbox__indicator");
        expect(root).toHaveClass("dextinityCheckbox");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(control).toHaveClass("dextinityCheckbox__control");
        expect(control).toHaveAttribute("data-checked");
        expect(indicator).toHaveAttribute("data-checked");
        expect(screen.getByText("Subscribe to the newsletter")).toHaveClass("dextinityCheckbox__label");
    });

    it("adds the consumer's class and style to the label root", () => {
        render(
            <Checkbox className="consumer" style={{ maxWidth: "20rem" }}>
                Subscribe to the newsletter
            </Checkbox>,
        );

        const root = screen.getByRole("checkbox").closest("label");
        expect(root).toHaveClass("dextinityCheckbox", "consumer");
        expect(root).toHaveStyle({ maxWidth: "20rem" });
        expect(screen.getByRole("checkbox")).not.toHaveClass("consumer");
    });

    it("passes the other props to the control, and renders no label part without children", () => {
        const { container } = render(<Checkbox aria-label="Select order 1024" name="orders" value="1024" />);

        expect(screen.getByRole("checkbox", { name: "Select order 1024" })).toHaveClass("dextinityCheckbox__control");
        expect(container.querySelector('input[name="orders"]')).toHaveAttribute("value", "1024");
        expect(container.querySelector(".dextinityCheckbox__label")).not.toBeInTheDocument();
    });

    it("renders no label part for content that renders nothing", () => {
        const { container } = render(<Checkbox aria-label="Publish product">{false}</Checkbox>);

        expect(container.querySelector(".dextinityCheckbox__label")).not.toBeInTheDocument();
    });

    it("renders the root as a span without a label, so an external label names the control", async () => {
        render(
            <>
                <label htmlFor="newsletter">Newsletter</label>
                <Checkbox id="newsletter" />
            </>,
        );

        const control = await screen.findByRole("checkbox", { name: "Newsletter" });
        expect(control.parentElement?.tagName).toBe("SPAN");
        expect(control.parentElement).toHaveClass("dextinityCheckbox");
    });

    it("reflects the disabled owner state on the label root", () => {
        render(<Checkbox disabled>Subscribe to the newsletter</Checkbox>);

        const control = screen.getByRole("checkbox", { name: "Subscribe to the newsletter" });
        expect(control.closest("label")).toHaveAttribute("data-disabled");
        expect(control).toHaveAttribute("data-disabled");
    });

    it("renders the indeterminate state on the control and the indicator", () => {
        render(<Checkbox indeterminate>Select all products</Checkbox>);

        const control = screen.getByRole("checkbox", { name: "Select all products" });
        expect(control).toHaveAttribute("aria-checked", "mixed");
        expect(control).toHaveAttribute("data-indeterminate");
        expect(control.querySelector(".dextinityCheckbox__indicator")).toHaveAttribute("data-indeterminate");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <Checkbox
                defaultChecked
                disabled
                slotProps={{
                    control: { className: "consumerControl" },
                    indicator: (ownerState) => ({ className: "consumerIndicator", title: ownerState.disabled ? "disabled" : "enabled" }),
                    label: (ownerState) => ({ className: "consumerLabel", title: ownerState.disabled ? "disabled" : "enabled" }),
                }}
            >
                Subscribe to the newsletter
            </Checkbox>,
        );

        const control = screen.getByRole("checkbox", { name: "Subscribe to the newsletter" });
        const indicator = control.querySelector(".dextinityCheckbox__indicator");
        const label = screen.getByText("Subscribe to the newsletter");
        expect(control).toHaveClass("dextinityCheckbox__control", "consumerControl");
        expect(indicator).toHaveClass("consumerIndicator");
        expect(indicator).toHaveAttribute("title", "disabled");
        expect(label).toHaveClass("dextinityCheckbox__label", "consumerLabel");
        expect(label).toHaveAttribute("title", "disabled");
    });
});
