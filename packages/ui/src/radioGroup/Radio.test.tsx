import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

describe("Radio", () => {
    it("renders the styling contract around a control labelled by its children", async () => {
        render(
            <RadioGroup label="Shipping method" defaultValue="express">
                <Radio value="express">Express</Radio>
            </RadioGroup>,
        );

        const control = await screen.findByRole("radio", { name: "Express" });
        const root = control.closest("label");
        expect(root).toHaveClass("dextinityRadio");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(control).toHaveClass("dextinityRadio__control");
        expect(control).toHaveAttribute("data-checked");
        expect(control.querySelector(".dextinityRadio__indicator")).toHaveAttribute("data-checked");
        expect(screen.getByText("Express")).toHaveClass("dextinityRadio__label");
    });

    it("adds the consumer's class and style to the label root", async () => {
        render(
            <RadioGroup label="Shipping method">
                <Radio value="express" className="consumer" style={{ maxWidth: "20rem" }}>
                    Express
                </Radio>
            </RadioGroup>,
        );

        const control = await screen.findByRole("radio", { name: "Express" });
        const root = control.closest("label");
        expect(root).toHaveClass("dextinityRadio", "consumer");
        expect(root).toHaveStyle({ maxWidth: "20rem" });
        expect(control).not.toHaveClass("consumer");
    });

    it("passes the other props to the control, and renders no label part without children", async () => {
        const { container } = render(
            <RadioGroup label="Color">
                <Radio value="red" aria-label="Red" id="color-red" />
            </RadioGroup>,
        );

        expect(await screen.findByRole("radio", { name: "Red" })).toHaveClass("dextinityRadio__control");
        expect(container.querySelector('input[type="radio"]')).toHaveAttribute("id", "color-red");
        expect(container.querySelector(".dextinityRadio__label")).not.toBeInTheDocument();
    });

    it("reflects the disabled owner state of the option and of the group on the label root", async () => {
        render(
            <>
                <RadioGroup label="Shipping method">
                    <Radio value="pickup" disabled>
                        Pickup
                    </Radio>
                </RadioGroup>
                <RadioGroup label="Payment plan" disabled>
                    <Radio value="monthly">Monthly</Radio>
                </RadioGroup>
            </>,
        );

        for (const name of ["Pickup", "Monthly"]) {
            const control = await screen.findByRole("radio", { name });
            expect(control.closest("label")).toHaveAttribute("data-disabled");
            expect(control).toHaveAttribute("aria-disabled", "true");
        }
    });

    it("merges slot props, resolving a function with the owner state", async () => {
        render(
            <RadioGroup label="Shipping method" defaultValue="express" disabled>
                <Radio
                    value="express"
                    slotProps={{
                        control: { className: "consumerControl" },
                        indicator: (ownerState) => ({ className: "consumerIndicator", title: ownerState.disabled ? "disabled" : "enabled" }),
                        label: (ownerState) => ({ className: "consumerLabel", title: ownerState.disabled ? "disabled" : "enabled" }),
                    }}
                >
                    Express
                </Radio>
            </RadioGroup>,
        );

        const control = await screen.findByRole("radio", { name: "Express" });
        const indicator = control.querySelector(".dextinityRadio__indicator");
        const label = screen.getByText("Express");
        expect(control).toHaveClass("dextinityRadio__control", "consumerControl");
        expect(indicator).toHaveClass("consumerIndicator");
        expect(indicator).toHaveAttribute("title", "disabled");
        expect(label).toHaveClass("dextinityRadio__label", "consumerLabel");
        expect(label).toHaveAttribute("title", "disabled");
    });
});
