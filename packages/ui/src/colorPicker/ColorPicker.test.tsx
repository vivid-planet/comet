import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { ColorPicker } from "./ColorPicker";

const presets = [
    { value: "#403af2", label: "Brand blue" },
    { value: "#F60", label: "Orange" },
    { value: "red", label: "Red" },
];

describe("ColorPicker", () => {
    it("renders the styling contracts of FormField and ColorPicker with the default owner state", () => {
        const { container } = render(<ColorPicker label="Brand color" />);

        const root = container.firstElementChild;
        const input = screen.getByRole("textbox", { name: "Brand color" });
        expect(root).toHaveClass("dextinityFormField", "dextinityColorPicker");
        expect(root).not.toHaveAttribute("data-required");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(root).not.toHaveAttribute("data-readonly");
        expect(input).toHaveClass("dextinityColorPicker__input");
        expect(input.closest(".dextinityColorPicker__group")).toBeInTheDocument();
        expect(container.querySelector(".dextinityColorPicker__swatch")).toHaveAttribute("data-empty");
        expect(container.querySelector(".dextinityColorPicker__picker")).toHaveAttribute("type", "color");
        expect(container.querySelector(".dextinityColorPicker__clear")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityColorPicker__presets")).not.toBeInTheDocument();
        expect(screen.getByText("Brand color")).toHaveClass("dextinityFormField__label");
    });

    it("shows the value in the input, the swatch and the picker", () => {
        const { container } = render(<ColorPicker label="Brand color" defaultValue="#403af2" />);

        const swatch = container.querySelector(".dextinityColorPicker__swatch");
        expect(screen.getByRole("textbox", { name: "Brand color" })).toHaveValue("#403af2");
        expect(swatch).not.toHaveAttribute("data-empty");
        expect(swatch).toHaveStyle({ backgroundColor: "#403af2" });
        expect(container.querySelector(".dextinityColorPicker__picker")).toHaveValue("#403af2");
    });

    it("hides the picker from assistive technology and Tab without a label, and names it with one", () => {
        const { container, rerender } = render(<ColorPicker label="Brand color" />);

        const picker = container.querySelector(".dextinityColorPicker__picker");
        expect(picker).toHaveAttribute("aria-hidden", "true");
        expect(picker).toHaveAttribute("tabindex", "-1");

        rerender(<ColorPicker label="Brand color" pickerLabel="Pick brand color" />);

        const namedPicker = screen.getByLabelText("Pick brand color");
        expect(namedPicker).toHaveClass("dextinityColorPicker__picker");
        expect(namedPicker).not.toHaveAttribute("aria-hidden");
        expect(namedPicker).not.toHaveAttribute("tabindex");
    });

    it("renders a named button for each preset with a hex color in a group named by the label, and marks the selected one", () => {
        render(<ColorPicker label="Brand color" defaultValue="#ff6600" presets={presets} />);

        const brandBlue = screen.getByRole("button", { name: "Brand blue" });
        const orange = screen.getByRole("button", { name: "Orange" });
        const group = screen.getByRole("group", { name: "Brand color" });
        expect(group).toHaveClass("dextinityColorPicker__presets");
        expect(group).toContainElement(brandBlue);
        expect(screen.queryByRole("button", { name: "Red" })).not.toBeInTheDocument();
        expect(brandBlue).toHaveClass("dextinityColorPicker__preset");
        expect(brandBlue).toHaveAttribute("aria-pressed", "false");
        expect(brandBlue).not.toHaveAttribute("data-pressed");
        expect(orange).toHaveAttribute("aria-pressed", "true");
        expect(orange).toHaveAttribute("data-pressed");
        expect(orange).toHaveStyle({ backgroundColor: "#ff6600" });
    });

    it("renders the clear button only with a label, while the input isn't empty and the field is optional", () => {
        const { container, rerender } = render(<ColorPicker label="Brand color" defaultValue="#403af2" />);

        expect(container.querySelector(".dextinityColorPicker__clear")).not.toBeInTheDocument();

        rerender(<ColorPicker label="Brand color" defaultValue="#403af2" clearLabel="Clear brand color" />);
        expect(screen.getByRole("button", { name: "Clear brand color" })).toHaveClass("dextinityColorPicker__clear");

        rerender(<ColorPicker label="Brand color" defaultValue="#403af2" clearLabel="Clear brand color" required />);
        expect(screen.queryByRole("button", { name: "Clear brand color" })).not.toBeInTheDocument();

        rerender(<ColorPicker label="Brand color" value={null} clearLabel="Clear brand color" />);
        expect(screen.queryByRole("button", { name: "Clear brand color" })).not.toBeInTheDocument();
    });

    it("describes the input with the description and the error, and marks it invalid", async () => {
        render(<ColorPicker label="Brand color" description="Used for buttons and links." error="Enter a hex color like #403af2." />);

        const input = screen.getByRole("textbox", { name: "Brand color" });
        expect(input).toHaveAttribute("aria-invalid", "true");
        await waitFor(() => expect(input).toHaveAccessibleDescription("Used for buttons and links. Enter a hex color like #403af2."));
    });

    it("requires a hex color in the input, submitted under its name", () => {
        const { container } = render(<ColorPicker label="Brand color" name="brandColor" required />);

        const input = screen.getByRole("textbox", { name: "Brand color" });
        expect(container.firstElementChild).toHaveAttribute("data-required");
        expect(input).toBeRequired();
        expect(input).toHaveAttribute("name", "brandColor");
        expect(input).toHaveAttribute("pattern", "#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})");
    });

    it("makes the input read-only and leaves out the picker, the presets and the clear button", () => {
        const { container } = render(
            <ColorPicker label="Brand color" defaultValue="#403af2" presets={presets} clearLabel="Clear brand color" pickerLabel="Pick" readOnly />,
        );

        expect(container.firstElementChild).toHaveAttribute("data-readonly");
        expect(screen.getByRole("textbox", { name: "Brand color" })).toHaveAttribute("readonly");
        expect(container.querySelector(".dextinityColorPicker__swatch")).toHaveStyle({ backgroundColor: "#403af2" });
        expect(container.querySelector(".dextinityColorPicker__picker")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityColorPicker__presets")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityColorPicker__clear")).not.toBeInTheDocument();
    });

    it("disables the input, the picker and the presets", () => {
        const { container } = render(<ColorPicker label="Brand color" presets={presets} disabled />);

        expect(container.firstElementChild).toHaveAttribute("data-disabled");
        expect(screen.getByRole("textbox", { name: "Brand color" })).toBeDisabled();
        expect(container.querySelector(".dextinityColorPicker__picker")).toBeDisabled();
        expect(screen.getByRole("button", { name: "Brand blue" })).toBeDisabled();
    });

    it("passes the other props and the ref to the input and adds the consumer's class and style to the root", () => {
        const ref = createRef<HTMLInputElement>();
        const { container } = render(
            <ColorPicker label="Brand color" className="consumer" style={{ maxWidth: "16rem" }} placeholder="#rrggbb" ref={ref} />,
        );

        const root = container.firstElementChild;
        const input = screen.getByRole("textbox", { name: "Brand color" });
        expect(root).toHaveClass("dextinityFormField", "dextinityColorPicker", "consumer");
        expect(root).toHaveStyle({ maxWidth: "16rem" });
        expect(input).not.toHaveClass("consumer");
        expect(input).toHaveAttribute("placeholder", "#rrggbb");
        expect(ref.current).toBe(input);
    });

    it("merges slot props into the parts, resolving a function with the owner state", () => {
        const { container } = render(
            <ColorPicker
                label="Brand color"
                required
                presets={presets}
                slotProps={{
                    group: { className: "consumerGroup" },
                    swatch: { className: "consumerSwatch" },
                    input: (ownerState) => ({ className: "consumerInput", title: ownerState.required ? "required" : "optional" }),
                    preset: (ownerState) => ({ className: "consumerPreset", title: ownerState.disabled ? "disabled" : "enabled" }),
                    label: (ownerState) => ({
                        className: "consumerLabel",
                        title: ownerState.readonly ? "readonly" : "editable",
                        id: "consumerLabelId",
                    }),
                }}
            />,
        );

        const input = screen.getByRole("textbox", { name: "Brand color" });
        const label = container.querySelector(".dextinityFormField__label");
        expect(container.querySelector(".dextinityColorPicker__group")).toHaveClass("consumerGroup");
        expect(container.querySelector(".dextinityColorPicker__swatch")).toHaveClass("consumerSwatch");
        expect(input).toHaveClass("dextinityColorPicker__input", "consumerInput");
        expect(input).toHaveAttribute("title", "required");
        expect(screen.getByRole("button", { name: "Orange" })).toHaveClass("dextinityColorPicker__preset", "consumerPreset");
        expect(screen.getByRole("button", { name: "Orange" })).toHaveAttribute("title", "enabled");
        expect(label).toHaveClass("consumerLabel");
        expect(label).toHaveAttribute("title", "editable");
        expect(label).toHaveAttribute("id", "consumerLabelId");
        expect(input).toHaveAccessibleName("Brand color");
        expect(container.querySelector(".dextinityColorPicker__presets")).toHaveAttribute("aria-labelledby", "consumerLabelId");
    });
});
