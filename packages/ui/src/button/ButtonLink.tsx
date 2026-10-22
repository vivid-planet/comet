"use client";

import { clsx } from "clsx";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import type { ButtonSize, ButtonTone, ButtonVariant } from "./Button";
// The link takes the button's look through the button's classes, which are public through the styling contract.
// eslint-disable-next-line @dextinity/no-private-sibling-import
import buttonStyles from "./Button.module.css";
import styles from "./ButtonLink.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type ButtonLinkOwnerState = {
    variant: ButtonVariant;
    size: ButtonSize;
    tone: ButtonTone;
};

/** @experimental */
export interface ButtonLinkSlotProps {
    /** The element around `startIcon`. */
    startIcon?: SlotProps<ElementSlotProps<"span">, ButtonLinkOwnerState>;
    /** The element around `endIcon`. */
    endIcon?: SlotProps<ElementSlotProps<"span">, ButtonLinkOwnerState>;
}

/** @experimental */
export interface ButtonLinkProps extends Omit<ComponentPropsWithRef<"a">, "className" | "style" | "children"> {
    /** The link's text, which names the page it leads to, for example "Add product". */
    children: ReactNode;
    /**
     * The URL of the page. Pass it, or a router's link component as `render`, which then takes the URL, for
     * example as `to`.
     */
    href?: string;
    /**
     * Replaces the `<a>` element, for a router's link component that changes the page without reloading it,
     * for example `render={<Link to="/products/new" />}`. It must render an `<a>` element. A function receives
     * the props to spread.
     */
    render?: ElementSlotProps<"a">["render"];
    /**
     * The link's emphasis, as for a `Button`: `primary` for the single main action of a view, `secondary` for
     * the actions next to it, and `ghost` for less important ones.
     *
     * @defaultValue `"primary"`
     */
    variant?: ButtonVariant;
    /**
     * The link's height, padding and text size, as for a `Button`. Use one size for all buttons in a group.
     *
     * @defaultValue `"medium"`
     */
    size?: ButtonSize;
    /**
     * Colors the link by what the page it leads to does, as for a `Button`: `danger` or `success`.
     *
     * @defaultValue `"default"`
     */
    tone?: ButtonTone;
    /** An icon before the text. It is decorative: the text names the link. */
    startIcon?: ReactNode;
    /** An icon after the text, for example an arrow. */
    endIcon?: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the link. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `startIcon` and `endIcon`. As a function, it receives the owner state:
     * `variant`, `size` and `tone`.
     */
    slotProps?: ButtonLinkSlotProps;
}

/**
 * A link that looks like a `Button`, for an action that opens another page, such as "Add product" leading to
 * the form of a new product.
 *
 * Use it where a button's emphasis fits but the action navigates: it renders an `<a>` element, so the
 * browser's link features work, such as opening the page in a new tab. Pass `href` for a plain link; for a
 * router's link, pass its link component as `render`, for example `render={<Link to="/products/new" />}`.
 * A link can't be disabled: render a disabled `Button` instead while the page isn't available.
 *
 * The props the component doesn't handle, such as `target`, `onClick` and `ref`, go to the `<a>` element.
 *
 * @summary A link in the look of a button, in the button's variants, tones and sizes.
 * @experimental
 */
export function ButtonLink({
    variant = "primary",
    size = "medium",
    tone = "default",
    startIcon,
    endIcon,
    className,
    slotProps,
    children,
    ...linkProps
}: ButtonLinkProps) {
    const ownerState: ButtonLinkOwnerState = { variant, size, tone };

    return (
        <SlotElement
            tagName="a"
            {...linkProps}
            data-variant={variant}
            data-size={size}
            data-tone={tone}
            className={clsx(buttonStyles.root, styles.root, className)}
        >
            {hasContent(startIcon) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({
                        ownProps: { className: buttonStyles.startIcon, "aria-hidden": true },
                        slotProps: slotProps?.startIcon,
                        ownerState,
                    })}
                >
                    {startIcon}
                </SlotElement>
            )}
            {children}
            {hasContent(endIcon) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({
                        ownProps: { className: buttonStyles.endIcon, "aria-hidden": true },
                        slotProps: slotProps?.endIcon,
                        ownerState,
                    })}
                >
                    {endIcon}
                </SlotElement>
            )}
        </SlotElement>
    );
}
