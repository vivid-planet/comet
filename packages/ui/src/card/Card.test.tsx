import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
    it("renders the styling contract with a header and a body", () => {
        render(
            <Card title="Billing address" description="Shown on your invoices." actions={<button type="button">Edit</button>}>
                Acme Corporation
            </Card>,
        );

        const title = screen.getByRole("heading", { level: 2, name: "Billing address" });
        const root = title.closest(".dextinityCard");
        expect(root?.tagName).toBe("DIV");
        expect(title).toHaveClass("dextinityCard__title");
        expect(title.parentElement).toHaveClass("dextinityCard__titleGroup");
        expect(title.parentElement?.parentElement).toHaveClass("dextinityCard__header");
        expect(screen.getByText("Shown on your invoices.")).toHaveClass("dextinityCard__description");
        expect(screen.getByText("Shown on your invoices.").tagName).toBe("P");
        expect(screen.getByRole("button", { name: "Edit" }).parentElement).toHaveClass("dextinityCard__actions");
        expect(screen.getByText("Acme Corporation")).toHaveClass("dextinityCard__body");
    });

    it("renders no header for a card without title, description and actions", () => {
        const { container } = render(<Card>Acme Corporation</Card>);

        expect(container.firstElementChild).toHaveClass("dextinityCard");
        expect(container.querySelector(".dextinityCard__header")).not.toBeInTheDocument();
        expect(screen.getByText("Acme Corporation")).toHaveClass("dextinityCard__body");
    });

    it("renders only the parts that have content", () => {
        const { container } = render(<Card title={false} description="" actions={<button type="button">Edit</button>} />);

        expect(container.querySelector(".dextinityCard__header")).toBeInTheDocument();
        expect(container.querySelector(".dextinityCard__titleGroup, .dextinityCard__title, .dextinityCard__description")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityCard__body")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Edit" }).parentElement).toHaveClass("dextinityCard__actions");
    });

    it("adds the consumer's class and style, and passes the other props to the root", () => {
        const { container } = render(
            <Card title="Billing address" className="consumer" style={{ maxWidth: "30rem" }} id="billing">
                Acme Corporation
            </Card>,
        );

        const root = container.firstElementChild;
        expect(root).toHaveClass("dextinityCard", "consumer");
        expect(root).toHaveStyle({ maxWidth: "30rem" });
        expect(root).toHaveAttribute("id", "billing");
    });

    it("replaces the root element through render, keeping its class", () => {
        render(
            <Card title="Billing address" render={<form aria-label="Billing address" />}>
                Acme Corporation
            </Card>,
        );

        const form = screen.getByRole("form", { name: "Billing address" });
        expect(form.tagName).toBe("FORM");
        expect(form).toHaveClass("dextinityCard");
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <Card
                title="Billing address"
                description="Shown on your invoices."
                actions={<button type="button">Edit</button>}
                slotProps={{
                    header: { className: "consumerHeader" },
                    titleGroup: { className: "consumerTitleGroup" },
                    title: { className: "consumerTitle", render: <h3 /> },
                    description: { className: "consumerDescription" },
                    actions: (ownerState) => ({ className: "consumerActions", title: String(Object.keys(ownerState).length) }),
                    body: { className: "consumerBody" },
                }}
            >
                Acme Corporation
            </Card>,
        );

        const title = screen.getByRole("heading", { level: 3, name: "Billing address" });
        expect(title).toHaveClass("dextinityCard__title", "consumerTitle");
        expect(title.parentElement).toHaveClass("dextinityCard__titleGroup", "consumerTitleGroup");
        expect(title.parentElement?.parentElement).toHaveClass("dextinityCard__header", "consumerHeader");
        expect(screen.getByText("Shown on your invoices.")).toHaveClass("dextinityCard__description", "consumerDescription");
        const actions = screen.getByRole("button", { name: "Edit" }).parentElement;
        expect(actions).toHaveClass("dextinityCard__actions", "consumerActions");
        expect(actions).toHaveAttribute("title", "0");
        expect(screen.getByText("Acme Corporation")).toHaveClass("dextinityCard__body", "consumerBody");
    });
});
