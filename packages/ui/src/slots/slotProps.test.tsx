import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { type ElementSlotProps, SlotElement } from "./SlotElement";
import { resolveSlotProps, type SlotProps } from "./slotProps";

type ProbeOwnerState = { variant: "primary" | "secondary" };

function SlotProbe({
    ownProps,
    slotProps,
}: {
    ownProps: ElementSlotProps<"span">;
    slotProps?: SlotProps<ElementSlotProps<"span">, ProbeOwnerState>;
}) {
    const props = resolveSlotProps({ ownProps, slotProps, ownerState: { variant: "primary" } });

    return (
        <SlotElement tagName="span" {...props}>
            probe
        </SlotElement>
    );
}

describe("resolveSlotProps", () => {
    it("keeps the own props when the consumer passes none", () => {
        expect(resolveSlotProps({ ownProps: { className: "own" }, slotProps: undefined, ownerState: {} })).toMatchObject({ className: "own" });
    });

    it("adds the consumer's class to the own class", () => {
        render(<SlotProbe ownProps={{ className: "own" }} slotProps={{ className: "consumer" }} />);

        expect(screen.getByText("probe")).toHaveClass("own", "consumer");
    });

    it("resolves a function with the owner state", () => {
        const slotProps: SlotProps<ElementSlotProps<"span">, ProbeOwnerState> = (ownerState) => ({ title: ownerState.variant });

        expect(resolveSlotProps({ ownProps: { className: "own" }, slotProps, ownerState: { variant: "secondary" } })).toMatchObject({
            className: "own",
            title: "secondary",
        });
    });

    it("runs both the own and the consumer's event handler", async () => {
        const handleOwnClick = vi.fn();
        const handleConsumerClick = vi.fn();

        render(<SlotProbe ownProps={{ onClick: handleOwnClick }} slotProps={{ onClick: handleConsumerClick }} />);
        await userEvent.click(screen.getByText("probe"));

        expect(handleOwnClick).toHaveBeenCalledOnce();
        expect(handleConsumerClick).toHaveBeenCalledOnce();
    });

    it("replaces the slot's element through `render`, keeping its own props", () => {
        render(<SlotProbe ownProps={{ className: "own" }} slotProps={{ render: <strong /> }} />);

        const probe = screen.getByText("probe");
        expect(probe.tagName).toBe("STRONG");
        expect(probe).toHaveClass("own");
    });
});
