import { render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import { Autocomplete, type AutocompleteOption } from "./Autocomplete";

const options: AutocompleteOption[] = [
    { value: "at", label: "Austria" },
    { value: "de", label: "Germany" },
    { value: "li", label: "Liechtenstein", disabled: true },
];

describe("Autocomplete", () => {
    it("renders the styling contracts of FormField and Autocomplete with the default owner state", () => {
        const { container } = render(<Autocomplete label="Country" options={options} />);

        const root = container.firstElementChild;
        const input = screen.getByRole("combobox", { name: "Country" });
        expect(root).toHaveClass("dextinityFormField", "dextinityAutocomplete");
        expect(root).not.toHaveAttribute("data-required");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(root).not.toHaveAttribute("data-readonly");
        expect(input).toHaveClass("dextinityAutocomplete__input");
        expect(input.closest(".dextinityAutocomplete__group")).toBeInTheDocument();
        expect(container.querySelector(".dextinityAutocomplete__trigger")).toHaveAttribute("tabindex", "-1");
        expect(screen.getByText("Country")).toHaveClass("dextinityFormField__label");
    });

    it("shows the selected option's label in the input", () => {
        render(<Autocomplete label="Country" options={options} defaultValue="de" />);

        expect(screen.getByRole("combobox", { name: "Country" })).toHaveValue("Germany");
    });

    it("renders the clear button only with `clearLabel`, while an option is selected", () => {
        const { rerender } = render(<Autocomplete label="Country" options={options} defaultValue="de" />);
        expect(screen.queryByRole("button", { name: "Clear country" })).not.toBeInTheDocument();

        rerender(<Autocomplete label="Country" options={options} defaultValue="de" clearLabel="Clear country" />);
        expect(screen.getByRole("button", { name: "Clear country" })).toHaveClass("dextinityAutocomplete__clear");
    });

    it("renders no clear button while nothing is selected or the field is read-only", () => {
        const { unmount } = render(<Autocomplete label="Country" options={options} clearLabel="Clear country" />);
        expect(screen.queryByRole("button", { name: "Clear country" })).not.toBeInTheDocument();
        unmount();

        render(<Autocomplete label="Country" options={options} clearLabel="Clear country" defaultValue="de" readOnly />);
        expect(screen.queryByRole("button", { name: "Clear country" })).not.toBeInTheDocument();
    });

    it("describes the input with the description and the error, and marks it invalid", async () => {
        render(<Autocomplete label="Country" options={options} description="We use it for taxes." error="Choose a country." />);

        const input = screen.getByRole("combobox", { name: "Country" });
        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input.closest(".dextinityAutocomplete__group")).toHaveAttribute("data-invalid");
        await waitFor(() => expect(input).toHaveAccessibleDescription("We use it for taxes. Choose a country."));
    });

    it("requires a value and shows a required indicator hidden from assistive technology", () => {
        const { container } = render(<Autocomplete label="Country" options={options} required />);

        expect(container.firstElementChild).toHaveAttribute("data-required");
        expect(container.querySelector(".dextinityFormField__requiredIndicator")).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByRole("combobox", { name: "Country" })).toBeRequired();
    });

    it("disables the input and dims the label", () => {
        const { container } = render(<Autocomplete label="Country" options={options} disabled />);

        expect(container.firstElementChild).toHaveAttribute("data-disabled");
        expect(screen.getByText("Country")).toHaveAttribute("data-disabled");
        expect(screen.getByRole("combobox", { name: "Country" })).toBeDisabled();
        expect(container.querySelector(".dextinityAutocomplete__group")).toHaveAttribute("data-disabled");
    });

    it("reflects readOnly on the root, the input and the box around it", () => {
        const { container } = render(<Autocomplete label="Country" options={options} readOnly />);

        expect(container.firstElementChild).toHaveAttribute("data-readonly");
        expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute("readonly");
        expect(container.querySelector(".dextinityAutocomplete__group")).toHaveAttribute("data-readonly");
    });

    it("passes the other props and the ref to the input, its id to the label, and adds the consumer's class to the root", () => {
        const ref = createRef<HTMLInputElement>();
        const { container } = render(
            <Autocomplete
                label="Country"
                options={options}
                className="consumer"
                id="country"
                placeholder="Start typing"
                aria-describedby="hint"
                ref={ref}
            />,
        );

        const input = screen.getByRole("combobox", { name: "Country" });
        expect(container.firstElementChild).toHaveClass("dextinityFormField", "dextinityAutocomplete", "consumer");
        expect(input).not.toHaveClass("consumer");
        expect(input).toHaveAttribute("id", "country");
        expect(input).toHaveAttribute("placeholder", "Start typing");
        expect(input.getAttribute("aria-describedby")).toContain("hint");
        expect(ref.current).toBe(input);
    });

    it("submits the selected option's value with `name`", () => {
        const { container } = render(
            <form>
                <Autocomplete label="Country" options={options} name="country" defaultValue="at" />
            </form>,
        );

        expect(new FormData(container.querySelector("form") ?? undefined).get("country")).toBe("at");
    });

    it("renders the parts of the open list with their classes", async () => {
        render(<Autocomplete label="Country" options={options} defaultValue="de" defaultOpen emptyMessage="No country matches." />);

        const listbox = await screen.findByRole("listbox");
        const germany = screen.getByRole("option", { name: "Germany" });
        expect(listbox).toHaveClass("dextinityAutocomplete__list");
        expect(listbox.closest(".dextinityAutocomplete__popup")).toBeInTheDocument();
        expect(listbox.closest(".dextinityAutocomplete__positioner")).toBeInTheDocument();
        expect(listbox.closest(".dextinityAutocomplete__popup")?.querySelector(".dextinityAutocomplete__empty")).toBeEmptyDOMElement();
        expect(germany).toHaveClass("dextinityAutocomplete__option");
        expect(germany).toHaveAttribute("data-selected");
        expect(germany.querySelector(".dextinityAutocomplete__optionText")).toHaveTextContent("Germany");
        expect(germany.querySelector(".dextinityAutocomplete__optionIndicator")).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Austria" }).querySelector(".dextinityAutocomplete__optionIndicator")).not.toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Liechtenstein" })).toHaveAttribute("data-disabled");
    });

    it("shows the empty message while no option matches", async () => {
        render(<Autocomplete label="Country" options={options} defaultOpen defaultInputValue="Atlantis" emptyMessage="No country matches." />);

        expect(await screen.findByText("No country matches.")).toHaveClass("dextinityAutocomplete__empty");
        expect(screen.queryByRole("option")).not.toBeInTheDocument();
    });

    it("hides the list and marks the input collapsed while no option matches and there's no empty message", async () => {
        const { container } = render(<Autocomplete label="Country" options={options} defaultOpen defaultInputValue="Atlantis" />);

        const input = screen.getByRole("combobox", { name: "Country" });
        await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
        expect(input).not.toHaveAttribute("aria-controls");
        expect(input).not.toHaveAttribute("data-popup-open");
        expect(input).toHaveValue("Atlantis");
        expect(container.querySelector(".dextinityAutocomplete__group")).not.toHaveAttribute("data-popup-open");
        expect(container.querySelector(".dextinityAutocomplete__trigger")).toHaveAttribute("aria-expanded", "false");
        expect(document.querySelector(".dextinityAutocomplete__positioner")).toHaveAttribute("hidden");
    });

    it("gives the open list the theme of a theme switch around the field", async () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <Autocomplete label="Country" options={options} open />
            </ThemeSwitch>,
        );

        const positioner = (await screen.findByRole("listbox")).closest(".dextinityAutocomplete__positioner");
        expect(positioner).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(positioner).toHaveAttribute("data-dextinity-color-scheme", "dark");
    });

    it("resolves the slot functions of all parts, also the form field's, with the autocomplete's owner state", () => {
        render(
            <Autocomplete
                label="Country"
                options={options}
                description="We use it for taxes."
                readOnly
                slotProps={{
                    input: (ownerState) => ({ title: ownerState.readonly ? "readonly" : "editable" }),
                    description: (ownerState) => ({ title: ownerState.readonly ? "readonly" : "editable" }),
                }}
            />,
        );

        expect(screen.getByRole("combobox", { name: "Country" })).toHaveAttribute("title", "readonly");
        expect(screen.getByText("We use it for taxes.")).toHaveAttribute("title", "readonly");
    });

    it("merges slot props into the parts, resolving a function with the owner state", async () => {
        render(
            <Autocomplete
                label="Country"
                options={options}
                required
                defaultOpen
                slotProps={{
                    input: (ownerState) => ({ className: "consumerInput", title: ownerState.required ? "required" : "optional" }),
                    group: { className: "consumerGroup" },
                    label: { className: "consumerLabel" },
                    option: { className: "consumerOption" },
                }}
            />,
        );

        const input = screen.getByRole("combobox", { name: "Country" });
        expect(input).toHaveClass("dextinityAutocomplete__input", "consumerInput");
        expect(input).toHaveAttribute("title", "required");
        expect(input.closest(".dextinityAutocomplete__group")).toHaveClass("consumerGroup");
        expect(screen.getByText("Country")).toHaveClass("dextinityFormField__label", "consumerLabel");
        await screen.findByRole("listbox");
        expect(screen.getByRole("option", { name: "Austria" })).toHaveClass("dextinityAutocomplete__option", "consumerOption");
    });
});
