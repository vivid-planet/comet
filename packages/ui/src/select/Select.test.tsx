import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import { Select, type SelectOption } from "./Select";

const options: SelectOption[] = [
    { value: "at", label: "Austria" },
    { value: "de", label: "Germany" },
    { value: "li", label: "Liechtenstein", disabled: true },
];

describe("Select", () => {
    it("renders the styling contracts of FormField and Select with the default owner state", () => {
        const { container } = render(<Select label="Country" options={options} />);

        const root = container.firstElementChild;
        const trigger = screen.getByRole("combobox", { name: "Country" });
        expect(root).toHaveClass("dextinityFormField", "dextinitySelect");
        expect(root).not.toHaveAttribute("data-required");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(root).not.toHaveAttribute("data-readonly");
        expect(trigger).toHaveClass("dextinitySelect__trigger");
        expect(trigger.querySelector(".dextinitySelect__value")).toBeInTheDocument();
        expect(trigger.querySelector(".dextinitySelect__icon")).toHaveAttribute("aria-hidden", "true");
    });

    it("renders the label as a non-native label that names the trigger", () => {
        render(<Select label="Country" options={options} />);

        const label = screen.getByText("Country");
        expect(label).toHaveClass("dextinityFormField__label");
        expect(label.tagName).toBe("DIV");
        expect(screen.getByRole("combobox")).toHaveAccessibleName("Country");
    });

    it("shows the selected option's label in the trigger before the list was opened", () => {
        render(<Select label="Country" options={options} defaultValue="de" />);

        expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent("Germany");
    });

    it("shows the placeholder while nothing is selected", () => {
        render(<Select label="Country" options={options} placeholder="Choose a country" />);

        const value = screen.getByText("Choose a country");
        expect(value).toHaveClass("dextinitySelect__value");
        expect(value).toHaveAttribute("data-placeholder");
    });

    it("describes the trigger with the description and the error, and marks it invalid", async () => {
        render(<Select label="Country" options={options} description="We only ship to these countries." error="Choose a country." />);

        const trigger = screen.getByRole("combobox", { name: "Country" });
        expect(trigger).toHaveAttribute("aria-invalid", "true");
        expect(trigger).toHaveAttribute("data-invalid");
        await waitFor(() => expect(trigger).toHaveAccessibleDescription("We only ship to these countries. Choose a country."));
    });

    it("requires a value and shows a required indicator hidden from assistive technology", () => {
        const { container } = render(<Select label="Country" options={options} required />);

        expect(container.firstElementChild).toHaveAttribute("data-required");
        expect(container.querySelector(".dextinityFormField__requiredIndicator")).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute("aria-required", "true");
    });

    it("disables the trigger and dims the label", () => {
        const { container } = render(<Select label="Country" options={options} disabled />);

        expect(container.firstElementChild).toHaveAttribute("data-disabled");
        expect(screen.getByText("Country")).toHaveAttribute("data-disabled");
        expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute("data-disabled");
    });

    it("reflects readOnly on the root and the trigger", () => {
        const { container } = render(<Select label="Country" options={options} readOnly />);

        expect(container.firstElementChild).toHaveAttribute("data-readonly");
        expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute("data-readonly");
    });

    it("passes the other props and the ref to the trigger, and adds the consumer's class to the root", () => {
        const ref = createRef<HTMLButtonElement>();
        const { container } = render(
            <Select label="Country" options={options} className="consumer" id="country" aria-describedby="hint" ref={ref} />,
        );

        const trigger = screen.getByRole("combobox", { name: "Country" });
        expect(container.firstElementChild).toHaveClass("dextinityFormField", "dextinitySelect", "consumer");
        expect(trigger).not.toHaveClass("consumer");
        expect(trigger).toHaveAttribute("id", "country");
        expect(trigger.getAttribute("aria-describedby")).toContain("hint");
        expect(ref.current).toBe(trigger);
    });

    it("submits the selected value with `name`", () => {
        const { container } = render(
            <form>
                <Select label="Country" options={options} name="country" defaultValue="at" />
            </form>,
        );

        expect(new FormData(container.querySelector("form") ?? undefined).get("country")).toBe("at");
    });

    it("renders the parts of the open list with their classes", async () => {
        render(<Select label="Country" options={options} defaultValue="de" defaultOpen />);

        const listbox = await screen.findByRole("listbox");
        const germany = screen.getByRole("option", { name: "Germany" });
        const liechtenstein = screen.getByRole("option", { name: "Liechtenstein" });
        expect(listbox).toHaveClass("dextinitySelect__list");
        expect(listbox.closest(".dextinitySelect__popup")).toBeInTheDocument();
        expect(listbox.closest(".dextinitySelect__positioner")).toHaveAttribute("data-align", "start");
        expect(germany).toHaveClass("dextinitySelect__option");
        expect(germany).toHaveAttribute("data-selected");
        expect(germany.querySelector(".dextinitySelect__optionText")).toHaveTextContent("Germany");
        expect(germany.querySelector(".dextinitySelect__optionIndicator")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Austria" }).querySelector(".dextinitySelect__optionIndicator")).not.toBeInTheDocument();
        expect(liechtenstein).toHaveAttribute("data-disabled");
    });

    it("gives the open list the theme of a theme switch around the field", async () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <Select label="Country" options={options} open />
            </ThemeSwitch>,
        );

        const positioner = (await screen.findByRole("listbox")).closest(".dextinitySelect__positioner");
        expect(positioner).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(positioner).toHaveAttribute("data-dextinity-color-scheme", "dark");
    });

    it("resolves the slot functions of all parts, also the form field's, with the select's owner state", () => {
        render(
            <Select
                label="Country"
                options={options}
                description="We only ship to these countries."
                readOnly
                slotProps={{
                    trigger: (ownerState) => ({ title: ownerState.readonly ? "readonly" : "editable" }),
                    description: (ownerState) => ({ title: ownerState.readonly ? "readonly" : "editable" }),
                }}
            />,
        );

        expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute("title", "readonly");
        expect(screen.getByText("We only ship to these countries.")).toHaveAttribute("title", "readonly");
    });

    it("merges slot props into the parts, resolving a function with the owner state", async () => {
        render(
            <Select
                label="Country"
                options={options}
                required
                defaultOpen
                slotProps={{
                    trigger: (ownerState) => ({ className: "consumerTrigger", title: ownerState.required ? "required" : "optional" }),
                    label: (ownerState) => ({ className: "consumerLabel", title: ownerState.required ? "required" : "optional" }),
                    popup: { className: "consumerPopup" },
                    option: { className: "consumerOption" },
                }}
            />,
        );

        const trigger = screen.getByRole("combobox", { name: "Country" });
        const label = screen.getByText("Country");
        expect(trigger).toHaveClass("dextinitySelect__trigger", "consumerTrigger");
        expect(trigger).toHaveAttribute("title", "required");
        expect(label).toHaveClass("dextinityFormField__label", "consumerLabel");
        expect(label).toHaveAttribute("title", "required");
        expect(label.tagName).toBe("DIV");
        expect((await screen.findByRole("listbox")).closest(".dextinitySelect__popup")).toHaveClass("consumerPopup");
        expect(screen.getByRole("option", { name: "Austria" })).toHaveClass("dextinitySelect__option", "consumerOption");
    });
});
