import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button/Button";
import { ThemeSwitch } from "../themeSwitch/ThemeSwitch";
import { Dialog } from "./Dialog";
import { DialogClose } from "./DialogClose";

describe("Dialog", () => {
    it("renders the styling contract with the default owner state", async () => {
        render(
            <Dialog defaultOpen title="Edit product" description="Changes are visible right away." actions={<Button>Save</Button>}>
                Content
            </Dialog>,
        );

        const dialog = await screen.findByRole("dialog", { name: "Edit product" });
        expect(dialog).toHaveClass("dextinityDialog");
        expect(dialog).toHaveAttribute("data-size", "medium");
        expect(dialog).toHaveAccessibleDescription("Changes are visible right away.");
        expect(screen.getByRole("heading", { name: "Edit product" })).toHaveClass("dextinityDialog__title");
        expect(screen.getByText("Changes are visible right away.")).toHaveClass("dextinityDialog__description");
        expect(screen.getByText("Content")).toHaveClass("dextinityDialog__body");
        expect(screen.getByRole("button", { name: "Save" }).parentElement).toHaveClass("dextinityDialog__actions");
        expect(document.querySelector(".dextinityDialog__backdrop")).toBeInTheDocument();
        expect(dialog.parentElement).toHaveClass("dextinityDialog__viewport");
    });

    it("reflects the size in a data attribute", async () => {
        render(<Dialog defaultOpen title="Delete product?" size="small" />);

        expect(await screen.findByRole("dialog", { name: "Delete product?" })).toHaveAttribute("data-size", "small");
    });

    it("adds the consumer's class and style to the popup, and passes the other props to it", async () => {
        render(<Dialog defaultOpen title="Edit product" id="edit-product" className="consumer" style={{ maxWidth: "30rem" }} />);

        const dialog = await screen.findByRole("dialog", { name: "Edit product" });
        expect(dialog).toHaveClass("dextinityDialog", "consumer");
        expect(dialog).toHaveStyle({ maxWidth: "30rem" });
        expect(dialog).toHaveAttribute("id", "edit-product");
    });

    it("renders no description, body, actions or close button without their props", async () => {
        render(<Dialog defaultOpen title="Edit product" description={false} actions="" />);

        await screen.findByRole("dialog", { name: "Edit product" });
        expect(document.querySelector(".dextinityDialog__description")).not.toBeInTheDocument();
        expect(document.querySelector(".dextinityDialog__body")).not.toBeInTheDocument();
        expect(document.querySelector(".dextinityDialog__actions")).not.toBeInTheDocument();
        expect(document.querySelector(".dextinityDialog__close")).not.toBeInTheDocument();
    });

    it("renders no close button for an empty closeLabel, which would leave it without a name", async () => {
        render(<Dialog defaultOpen title="Edit product" closeLabel="" />);

        await screen.findByRole("dialog", { name: "Edit product" });
        expect(document.querySelector(".dextinityDialog__close")).not.toBeInTheDocument();
    });

    it("opens from its trigger, which keeps its own classes", async () => {
        render(<Dialog trigger={<Button variant="secondary">Edit product</Button>} title="Edit product" />);

        const trigger = screen.getByRole("button", { name: "Edit product" });
        expect(trigger).toHaveClass("dextinityButton");
        expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

        await userEvent.click(trigger);
        expect(await screen.findByRole("dialog", { name: "Edit product" })).toBeInTheDocument();
        expect(trigger).toHaveAttribute("data-popup-open");
    });

    it("renders a close button named by closeLabel, which closes the dialog", async () => {
        const handleOpenChange = vi.fn();
        render(<Dialog defaultOpen title="Edit product" closeLabel="Close" onOpenChange={handleOpenChange} />);

        const closeButton = await screen.findByRole("button", { name: "Close" });
        expect(closeButton).toHaveClass("dextinityButton", "dextinityIconButton", "dextinityDialog__close");

        await userEvent.click(closeButton);
        expect(handleOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("makes a DialogClose button close the dialog, without an element of its own", async () => {
        const handleCancel = vi.fn();
        const handleOpenChange = vi.fn();
        render(
            <Dialog
                defaultOpen
                title="Delete product?"
                onOpenChange={handleOpenChange}
                actions={
                    <DialogClose>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </DialogClose>
                }
            />,
        );

        const cancelButton = await screen.findByRole("button", { name: "Cancel" });
        expect(cancelButton).toHaveClass("dextinityButton");
        expect(cancelButton.parentElement).toHaveClass("dextinityDialog__actions");

        await userEvent.click(cancelButton);
        expect(handleCancel).toHaveBeenCalledOnce();
        expect(handleOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    });

    it("merges slot props, resolving a function with the owner state", async () => {
        render(
            <Dialog
                defaultOpen
                title="Edit product"
                description="Changes are visible right away."
                actions={<Button>Save</Button>}
                closeLabel="Close"
                size="large"
                slotProps={{
                    backdrop: { className: "consumerBackdrop" },
                    viewport: { className: "consumerViewport" },
                    title: (ownerState) => ({ className: "consumerTitle", title: ownerState.size }),
                    description: { className: "consumerDescription" },
                    body: (ownerState) => ({ className: "consumerBody", title: ownerState.size }),
                    actions: { className: "consumerActions" },
                    close: { className: "consumerClose" },
                }}
            >
                Content
            </Dialog>,
        );

        const dialog = await screen.findByRole("dialog", { name: "Edit product" });
        expect(document.querySelector(".dextinityDialog__backdrop")).toHaveClass("consumerBackdrop");
        expect(dialog.parentElement).toHaveClass("dextinityDialog__viewport", "consumerViewport");
        expect(screen.getByRole("heading", { name: "Edit product" })).toHaveClass("dextinityDialog__title", "consumerTitle");
        expect(screen.getByRole("heading", { name: "Edit product" })).toHaveAttribute("title", "large");
        expect(screen.getByText("Changes are visible right away.")).toHaveClass("dextinityDialog__description", "consumerDescription");
        expect(screen.getByText("Content")).toHaveClass("dextinityDialog__body", "consumerBody");
        expect(screen.getByText("Content")).toHaveAttribute("title", "large");
        expect(screen.getByRole("button", { name: "Save" }).parentElement).toHaveClass("dextinityDialog__actions", "consumerActions");
        expect(screen.getByRole("button", { name: "Close" })).toHaveClass("dextinityDialog__close", "consumerClose");
    });

    it("replaces the title's element through slot props", async () => {
        render(<Dialog defaultOpen title="Edit product" slotProps={{ title: { render: <h3 /> } }} />);

        await screen.findByRole("dialog", { name: "Edit product" });
        const title = screen.getByRole("heading", { name: "Edit product", level: 3 });
        expect(title).toHaveClass("dextinityDialog__title");
    });

    it("gives the backdrop and the viewport the theme of the theme switch around the trigger", async () => {
        render(
            <ThemeSwitch theme="sunset" colorScheme="dark">
                <Dialog trigger={<Button>Edit product</Button>} title="Edit product" />
            </ThemeSwitch>,
        );

        await userEvent.click(screen.getByRole("button", { name: "Edit product" }));

        const viewport = (await screen.findByRole("dialog", { name: "Edit product" })).parentElement;
        for (const themedElement of [viewport, document.querySelector(".dextinityDialog__backdrop")]) {
            expect(themedElement).toHaveAttribute("data-dextinity-theme", "sunset");
            expect(themedElement).toHaveAttribute("data-dextinity-color-scheme", "dark");
        }
    });

    it("takes the theme around the focused element when it opens without a trigger", async () => {
        function OpenFromButton() {
            const [open, setOpen] = useState(false);

            return (
                <>
                    <ThemeSwitch theme="sunset" colorScheme="dark">
                        <Button onClick={() => setOpen(true)}>Edit product</Button>
                    </ThemeSwitch>
                    <Dialog open={open} onOpenChange={setOpen} title="Edit product" />
                </>
            );
        }
        render(<OpenFromButton />);

        await userEvent.click(screen.getByRole("button", { name: "Edit product" }));

        const viewport = (await screen.findByRole("dialog", { name: "Edit product" })).parentElement;
        expect(viewport).toHaveAttribute("data-dextinity-theme", "sunset");
        expect(viewport).toHaveAttribute("data-dextinity-color-scheme", "dark");
    });
});
