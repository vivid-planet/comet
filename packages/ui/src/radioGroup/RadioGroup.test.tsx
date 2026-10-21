import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Radio } from "./Radio";
import { RadioGroup, type RadioGroupProps } from "./RadioGroup";

function ShippingMethod(props: Partial<RadioGroupProps<string>>) {
    return (
        <RadioGroup label="Shipping method" {...props}>
            <Radio value="standard">Standard</Radio>
            <Radio value="express">Express</Radio>
        </RadioGroup>
    );
}

describe("RadioGroup", () => {
    it("renders the styling contract with the default owner state, named by its label", async () => {
        render(<ShippingMethod />);

        const group = await screen.findByRole("radiogroup", { name: "Shipping method" });
        expect(group).toHaveClass("dextinityRadioGroup");
        expect(group).toHaveAttribute("data-orientation", "vertical");
        expect(group).not.toHaveAttribute("data-disabled");
        expect(group).not.toHaveAttribute("data-required");
        expect(screen.getByText("Shipping method")).toHaveClass("dextinityRadioGroup__label");
        expect(screen.getByRole("radio", { name: "Standard" }).closest(".dextinityRadioGroup__options")).toBeInTheDocument();
        expect(group.querySelector(".dextinityRadioGroup__description, .dextinityRadioGroup__error")).not.toBeInTheDocument();
    });

    it("reflects the owner state in data attributes", async () => {
        render(<ShippingMethod orientation="horizontal" disabled required />);

        const group = await screen.findByRole("radiogroup", { name: "Shipping method" });
        expect(group).toHaveAttribute("data-orientation", "horizontal");
        expect(group).toHaveAttribute("data-disabled");
        expect(group).toHaveAttribute("data-required");
        expect(group).toHaveAttribute("aria-required", "true");
    });

    it("marks a required group with an indicator that assistive technology skips", async () => {
        render(<ShippingMethod required />);

        const group = await screen.findByRole("radiogroup", { name: "Shipping method" });
        const indicator = group.querySelector(".dextinityRadioGroup__label > .dextinityRadioGroup__requiredIndicator");
        expect(indicator).toHaveTextContent("*");
        expect(indicator).toHaveAttribute("aria-hidden", "true");
    });

    it("describes the group with its description and error", async () => {
        render(<ShippingMethod description="Express arrives the next working day." error="Select a shipping method." />);

        await screen.findByRole("radiogroup", {
            name: "Shipping method",
            description: "Express arrives the next working day. Select a shipping method.",
        });
        expect(screen.getByText("Express arrives the next working day.")).toHaveClass("dextinityRadioGroup__description");
        expect(screen.getByText("Select a shipping method.")).toHaveClass("dextinityRadioGroup__error");
    });

    it("is invalid while an error is set", async () => {
        render(<ShippingMethod error="Select a shipping method." />);

        const group = await screen.findByRole("radiogroup", { name: "Shipping method" });
        expect(group).toHaveAttribute("aria-invalid", "true");
        expect(group).toHaveAttribute("data-invalid");
        expect(screen.getByRole("radio", { name: "Standard" })).toHaveAttribute("data-invalid");
    });

    it("treats an empty error as no error", async () => {
        render(<ShippingMethod error={false} description="" />);

        const group = await screen.findByRole("radiogroup", { name: "Shipping method" });
        expect(group).not.toHaveAttribute("aria-invalid");
        expect(group).not.toHaveAttribute("aria-describedby");
        expect(group.querySelector(".dextinityRadioGroup__description, .dextinityRadioGroup__error")).not.toBeInTheDocument();
    });

    it("passes the other props to the group", async () => {
        const { container } = render(<ShippingMethod name="shipping" defaultValue="express" />);

        await screen.findByRole("radiogroup", { name: "Shipping method" });
        expect(screen.getByRole("radio", { name: "Express" })).toHaveAttribute("aria-checked", "true");
        expect(container.querySelectorAll('input[name="shipping"]')).toHaveLength(2);
    });

    it("adds the consumer's class to the contract class", async () => {
        render(<ShippingMethod className="consumer" />);

        expect(await screen.findByRole("radiogroup", { name: "Shipping method" })).toHaveClass("dextinityRadioGroup", "consumer");
    });

    it("merges slot props, resolving a function with the owner state", async () => {
        render(
            <ShippingMethod
                orientation="horizontal"
                required
                description="Express arrives the next working day."
                error="Select a shipping method."
                slotProps={{
                    label: { className: "consumerLabel" },
                    requiredIndicator: { className: "consumerRequiredIndicator", children: "(required)" },
                    options: (ownerState) => ({ className: "consumerOptions", title: ownerState.orientation }),
                    description: { className: "consumerDescription" },
                    error: { className: "consumerError" },
                }}
            />,
        );

        const group = await screen.findByRole("radiogroup", { name: "Shipping method" });
        const options = screen.getByRole("radio", { name: "Standard" }).closest(".dextinityRadioGroup__options");
        expect(group.querySelector(".dextinityRadioGroup__label")).toHaveClass("consumerLabel");
        expect(screen.getByText("(required)")).toHaveClass("dextinityRadioGroup__requiredIndicator", "consumerRequiredIndicator");
        expect(options).toHaveClass("consumerOptions");
        expect(options).toHaveAttribute("title", "horizontal");
        expect(screen.getByText("Express arrives the next working day.")).toHaveClass("dextinityRadioGroup__description", "consumerDescription");
        expect(screen.getByText("Select a shipping method.")).toHaveClass("dextinityRadioGroup__error", "consumerError");
    });
});
