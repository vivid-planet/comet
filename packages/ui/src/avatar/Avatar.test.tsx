import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
    it("renders the styling contract with the default owner state, showing the initials", () => {
        const { container } = render(<Avatar name="Jane Doe" />);

        const root = container.firstElementChild;
        const fallback = screen.getByRole("img", { name: "Jane Doe" });
        expect(root).toHaveClass("dextinityAvatar");
        expect(root).toHaveAttribute("data-size", "medium");
        expect(root).not.toHaveAttribute("role");
        expect(fallback).toHaveClass("dextinityAvatar__fallback");
        expect(fallback).toHaveTextContent("JD");
        expect(container.querySelector(".dextinityAvatar__image")).not.toBeInTheDocument();
    });

    it("reflects the size in a data attribute", () => {
        const { container } = render(<Avatar name="Jane Doe" size="large" />);

        expect(container.firstElementChild).toHaveAttribute("data-size", "large");
    });

    it.each([
        ["Jane Doe", "JD"],
        ["jane", "J"],
        ["  Anna   Maria  Schmidt ", "AS"],
        ["Émile Zola", "ÉZ"],
        ["(Max) Mustermann", "MM"],
    ])("shows the initials of %j as %j", (name, initials) => {
        render(<Avatar name={name} />);

        expect(screen.getByRole("img")).toHaveTextContent(initials);
    });

    it("shows a person icon for a name without a letter or digit, keeping the name", () => {
        const { container } = render(<Avatar name="—" />);

        expect(screen.getByRole("img", { name: "—" })).toHaveClass("dextinityAvatar__fallback");
        expect(container.querySelector(".dextinityAvatar__fallback > .dextinityIcon")).toHaveAttribute("data-icon", "user");
    });

    it("is decorative without a name, showing a person icon", () => {
        const { container } = render(<Avatar name=" " src="/unknown.png" />);

        expect(screen.queryByRole("img")).not.toBeInTheDocument();
        expect(container.querySelector(".dextinityAvatar__fallback")).not.toHaveAttribute("aria-label");
        expect(container.querySelector(".dextinityAvatar__fallback > .dextinityIcon")).toHaveAttribute("data-icon", "user");
        expect(container.querySelector(".dextinityAvatar__image")).toHaveAttribute("alt", "");
    });

    it("names the person once: by the initials while the image loads, by the image once it has loaded", () => {
        render(<Avatar name="Jane Doe" src="/jane.png" />);

        const image = screen.getByAltText("Jane Doe");
        expect(image).toHaveClass("dextinityAvatar__image");
        expect(image).toHaveAttribute("src", "/jane.png");
        expect(image).toHaveAttribute("alt", "Jane Doe");
        expect(screen.getAllByRole("img", { name: "Jane Doe" })).toEqual([screen.getByText("JD")]);

        fireEvent.load(image);

        expect(screen.getAllByRole("img", { name: "Jane Doe" })).toEqual([image]);
        expect(screen.queryByText("JD")).not.toBeInTheDocument();
    });

    it("keeps the initials when the image fails to load", () => {
        render(<Avatar name="Jane Doe" src="/missing.png" />);

        const image = screen.getByAltText("Jane Doe");
        fireEvent.error(image);

        expect(image).toHaveAttribute("data-error");
        expect(screen.getAllByRole("img", { name: "Jane Doe" })).toEqual([screen.getByText("JD")]);
    });

    it("passes other attributes, className and style to the root", () => {
        const { container } = render(<Avatar name="Jane Doe" aria-hidden className="consumer" style={{ marginInlineEnd: "1rem" }} />);

        const root = container.firstElementChild;
        expect(root).toHaveClass("dextinityAvatar", "consumer");
        expect(root).toHaveAttribute("aria-hidden", "true");
        expect(root).toHaveStyle({ marginInlineEnd: "1rem" });
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("merges slot props, resolving a function with the owner state", () => {
        render(
            <Avatar
                name="Jane Doe"
                size="small"
                src="/jane.png"
                slotProps={{
                    image: { className: "consumer-image", loading: "lazy" },
                    fallback: (ownerState) => ({ className: "consumer-fallback", "data-size": ownerState.size }),
                }}
            />,
        );

        const image = screen.getByAltText("Jane Doe");
        const fallback = screen.getByText("JD");
        expect(image).toHaveClass("dextinityAvatar__image", "consumer-image");
        expect(image).toHaveAttribute("loading", "lazy");
        expect(fallback).toHaveClass("dextinityAvatar__fallback", "consumer-fallback");
        expect(fallback).toHaveAttribute("data-size", "small");
    });

    it("replaces the initials with the fallback slot's children", () => {
        render(<Avatar name="Jane Doe" slotProps={{ fallback: { children: <span data-testid="custom" /> } }} />);

        const fallback = screen.getByRole("img", { name: "Jane Doe" });
        expect(fallback).not.toHaveTextContent("JD");
        expect(screen.getByTestId("custom").parentElement).toBe(fallback);
    });
});
