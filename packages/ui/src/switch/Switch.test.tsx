import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
    it("renders the styling contract around a control labelled by its children", () => {
        render(<Switch defaultChecked>Email notifications</Switch>);

        const control = screen.getByRole("switch", { name: "Email notifications" });
        const root = control.closest(".dextinitySwitch");
        const thumb = control.querySelector(".dextinitySwitch__thumb");
        expect(root).toHaveClass("dextinitySwitch");
        expect(root).not.toHaveAttribute("data-disabled");
        expect(control).toHaveClass("dextinitySwitch__control");
        expect(control).toHaveAttribute("data-checked");
        expect(thumb).toHaveAttribute("data-checked");
        expect(screen.getByText("Email notifications")).toHaveClass("dextinitySwitch__label");
    });

    it("adds the consumer's class and style to the root", () => {
        render(
            <Switch className="consumer" style={{ maxWidth: "20rem" }}>
                Email notifications
            </Switch>,
        );

        const root = screen.getByRole("switch").closest(".dextinitySwitch");
        expect(root).toHaveClass("dextinitySwitch", "consumer");
        expect(root).toHaveStyle({ maxWidth: "20rem" });
        expect(screen.getByRole("switch")).not.toHaveClass("consumer");
    });

    it("passes the other props to the control, and renders no label part without children", () => {
        const { container } = render(<Switch aria-label="Publish product" name="published" value="yes" />);

        expect(screen.getByRole("switch", { name: "Publish product" })).toHaveClass("dextinitySwitch__control");
        expect(container.querySelector('input[name="published"]')).toHaveAttribute("value", "yes");
        expect(container.querySelector(".dextinitySwitch__label")).not.toBeInTheDocument();
    });

    it("renders no label part for content that renders nothing", () => {
        const { container } = render(<Switch aria-label="Publish product">{false}</Switch>);

        expect(container.querySelector(".dextinitySwitch__label")).not.toBeInTheDocument();
    });

    it("lets an external label name the control", async () => {
        render(
            <>
                <label htmlFor="newsletter">Newsletter</label>
                <Switch id="newsletter" />
            </>,
        );

        const control = await screen.findByRole("switch", { name: "Newsletter" });
        expect(control.closest("label")).toBeNull();
    });

    it("reflects the disabled owner state on the root", () => {
        render(<Switch disabled>Email notifications</Switch>);

        const control = screen.getByRole("switch", { name: "Email notifications" });
        expect(control.closest(".dextinitySwitch")).toHaveAttribute("data-disabled");
        expect(control).toHaveAttribute("data-disabled");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <Switch
                disabled
                slotProps={{
                    control: { className: "consumerControl" },
                    thumb: (ownerState) => ({ className: "consumerThumb", title: ownerState.disabled ? "disabled" : "enabled" }),
                    label: (ownerState) => ({ className: "consumerLabel", title: ownerState.disabled ? "disabled" : "enabled" }),
                }}
            >
                Email notifications
            </Switch>,
        );

        const control = screen.getByRole("switch", { name: "Email notifications" });
        const thumb = control.querySelector(".dextinitySwitch__thumb");
        const label = screen.getByText("Email notifications");
        expect(control).toHaveClass("dextinitySwitch__control", "consumerControl");
        expect(thumb).toHaveClass("consumerThumb");
        expect(thumb).toHaveAttribute("title", "disabled");
        expect(label).toHaveClass("dextinitySwitch__label", "consumerLabel");
        expect(label).toHaveAttribute("title", "disabled");
    });
});
