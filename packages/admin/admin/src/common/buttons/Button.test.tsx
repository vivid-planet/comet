import { Add } from "@dextinity/admin-icons";
import { Link } from "react-router-dom";
import { cleanup, fireEvent, render, screen } from "test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it("maps the admin variants onto the variants and tones of the ui button", () => {
        render(
            <>
                <Button>Save</Button>
                <Button variant="outlined">Cancel</Button>
                <Button variant="destructive">Delete</Button>
                <Button variant="success">Publish</Button>
                <Button variant="textDark">Details</Button>
            </>,
        );

        expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-variant", "primary");
        expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute("data-variant", "secondary");
        expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute("data-variant", "secondary");
        expect(screen.getByRole("button", { name: "Delete" })).toHaveAttribute("data-tone", "danger");
        expect(screen.getByRole("button", { name: "Publish" })).toHaveAttribute("data-variant", "primary");
        expect(screen.getByRole("button", { name: "Publish" })).toHaveAttribute("data-tone", "success");
        expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute("data-variant", "ghost");
    });

    it("renders a link component, such as a router link, in the look of a button", () => {
        render(
            <Button component={Link} to="/products/new" variant="secondary">
                Add product
            </Button>,
        );

        const link = screen.getByRole("link", { name: "Add product" });
        expect(link).toHaveAttribute("href", "/products/new");
        expect(link).toHaveClass("dextinityButton", "dextinityButtonLink");
        expect(link).toHaveAttribute("data-variant", "secondary");
    });

    it("renders a link for href", () => {
        render(<Button href="/">Return to home page</Button>);

        expect(screen.getByRole("link", { name: "Return to home page" })).toHaveAttribute("href", "/");
    });

    it("keeps a disabled link from navigating", () => {
        const handleClick = vi.fn();
        render(
            <div onClick={(event) => handleClick(event.defaultPrevented)}>
                <Button href="/products" disabled>
                    Products
                </Button>
            </div>,
        );

        const link = screen.getByRole("link", { name: "Products" });
        expect(link).toHaveAttribute("aria-disabled", "true");
        expect(link).toHaveAttribute("data-disabled");
        fireEvent.click(link);
        expect(handleClick).toHaveBeenCalledWith(true);
    });

    it("shows only the icon below the mobile breakpoint, keeping the text as the accessible name", () => {
        vi.stubGlobal("innerWidth", 400);
        render(
            <Button responsive startIcon={<Add />}>
                Add product
            </Button>,
        );

        expect(screen.getByRole("button", { name: "Add product" })).toBeInTheDocument();
    });
});
