import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "./Alert";

describe("Alert", () => {
    it("renders the styling contract with the default owner state", () => {
        const { container } = render(<Alert>Prices include VAT.</Alert>);

        const root = container.firstElementChild;
        const message = screen.getByText("Prices include VAT.");
        expect(root).toHaveClass("dextinityAlert");
        expect(root).toHaveAttribute("data-tone", "info");
        expect(root).not.toHaveAttribute("role");
        expect(message).toHaveClass("dextinityAlert__message");
        expect(message.parentElement).toHaveClass("dextinityAlert__content");
        expect(container.querySelector(".dextinityAlert__icon > .dextinityIcon")).toHaveAttribute("data-icon", "info");
        expect(container.querySelector(".dextinityAlert__title")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityAlert__action")).not.toBeInTheDocument();
    });

    it("reflects the tone in a data attribute and shows the tone's icon", () => {
        const { container } = render(<Alert tone="danger">The product couldn't be saved.</Alert>);

        expect(container.firstElementChild).toHaveAttribute("data-tone", "danger");
        expect(container.querySelector(".dextinityAlert__icon > .dextinityIcon")).toHaveAttribute("data-icon", "danger");
    });

    it("renders the title and the action parts around the message", () => {
        render(
            <Alert title="Upload failed" action={<button type="button">Retry</button>}>
                The image is larger than 10 MB.
            </Alert>,
        );

        const title = screen.getByText("Upload failed");
        expect(title).toHaveClass("dextinityAlert__title");
        expect(title.parentElement).toHaveClass("dextinityAlert__content");
        expect(screen.getByRole("button", { name: "Retry" }).parentElement).toHaveClass("dextinityAlert__action");
    });

    it("replaces the icon, or renders no icon part for content that renders nothing", () => {
        const { container, rerender } = render(<Alert icon={<svg data-testid="custom" />}>Prices include VAT.</Alert>);

        expect(screen.getByTestId("custom").parentElement).toHaveClass("dextinityAlert__icon");
        expect(container.querySelector(".dextinityIcon")).not.toBeInTheDocument();

        rerender(<Alert icon={false}>Prices include VAT.</Alert>);
        expect(container.querySelector(".dextinityAlert__icon")).not.toBeInTheDocument();
    });

    it("hides the default icon from assistive technology, and announces a labelled one", () => {
        const { container, rerender } = render(<Alert tone="warning">Only 3 left in stock.</Alert>);

        expect(container.querySelector(".dextinityIcon")).toHaveAttribute("aria-hidden", "true");
        expect(container.querySelector(".dextinityAlert__icon")).not.toHaveAttribute("aria-hidden");

        rerender(<Alert icon={<span role="img" aria-label="Warning" />}>Only 3 left in stock.</Alert>);
        expect(screen.getByRole("img", { name: "Warning" })).toBeInTheDocument();
    });

    it("passes the role, other attributes, className, style and the ref to the root", () => {
        const ref = createRef<HTMLDivElement>();
        render(
            <Alert role="status" id="save-status" className="consumer" style={{ maxWidth: "40rem" }} ref={ref}>
                Changes saved.
            </Alert>,
        );

        const root = screen.getByRole("status");
        expect(root).toHaveClass("dextinityAlert", "consumer");
        expect(root).toHaveAttribute("id", "save-status");
        expect(root).toHaveStyle({ maxWidth: "40rem" });
        expect(root).toHaveTextContent("Changes saved.");
        expect(ref.current).toBe(root);
    });

    it("merges slot props, resolving a function with the owner state", () => {
        const { container } = render(
            <Alert
                tone="success"
                title="Published"
                slotProps={{
                    icon: { className: "consumer-icon" },
                    title: (ownerState) => ({ className: "consumer-title", "data-tone": ownerState.tone }),
                    message: { style: { maxWidth: "30rem" } },
                }}
            >
                The product is visible in the shop.
            </Alert>,
        );

        const title = screen.getByText("Published");
        expect(container.querySelector(".dextinityAlert__icon")).toHaveClass("consumer-icon");
        expect(title).toHaveClass("dextinityAlert__title", "consumer-title");
        expect(title).toHaveAttribute("data-tone", "success");
        expect(screen.getByText("The product is visible in the shop.")).toHaveStyle({ maxWidth: "30rem" });
    });

    it("replaces a slot's element through render, keeping its class", () => {
        render(
            <Alert title="Payment failed" slotProps={{ title: { render: <h2 /> } }}>
                The card was declined.
            </Alert>,
        );

        expect(screen.getByRole("heading", { level: 2, name: "Payment failed" })).toHaveClass("dextinityAlert__title");
    });

    it("renders no close button without a closeLabel, which would leave it without a name", () => {
        render(<Alert onClose={() => {}}>Saved.</Alert>);

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders a close button named by closeLabel, which calls onClose", () => {
        const handleClose = vi.fn();
        render(
            <Alert closeLabel="Close" onClose={handleClose} slotProps={{ close: { className: "consumer-close" } }}>
                Saved.
            </Alert>,
        );

        const closeButton = screen.getByRole("button", { name: "Close" });
        expect(closeButton).toHaveClass("dextinityButton", "dextinityIconButton", "dextinityAlert__close", "consumer-close");
        fireEvent.click(closeButton);
        expect(handleClose).toHaveBeenCalledOnce();
    });
});
