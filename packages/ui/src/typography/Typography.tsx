"use client";

import { useRender } from "@base-ui/react/use-render";
import { clsx } from "clsx";
import type { HTMLAttributes, JSX, ReactNode, Ref } from "react";

import styles from "./Typography.module.css";

/** @experimental */
export type TypographyVariant =
    "display" | "heading1" | "heading2" | "heading3" | "heading4" | "bodyLarge" | "body" | "bodySmall" | "label" | "overline";

/** @experimental */
export type TypographyTone = "default" | "muted";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type TypographyOwnerState = {
    variant: TypographyVariant;
    tone: TypographyTone;
};

const defaultTagNames: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
    display: "h1",
    heading1: "h1",
    heading2: "h2",
    heading3: "h3",
    heading4: "h4",
    bodyLarge: "p",
    body: "p",
    bodySmall: "p",
    label: "span",
    overline: "span",
};

/** @experimental */
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
    /**
     * The text style, chosen by the text's role. Each style renders its own element, which `render` replaces:
     *
     * - `display` (`h1`): a page's single, most prominent title, for example on a start page.
     * - `heading1` (`h1`): a page title.
     * - `heading2` (`h2`): a section title.
     * - `heading3` (`h3`): a subsection title.
     * - `heading4` (`h4`): the title of a card, a dialog or a group of fields.
     * - `bodyLarge` (`p`): an introduction or lead paragraph.
     * - `body` (`p`): running text.
     * - `bodySmall` (`p`): secondary text, such as a caption or a hint.
     * - `label` (`span`): the name of a value, such as "Status" above a product's status.
     * - `overline` (`span`): a short line above a heading that names its category.
     *
     * @defaultValue `"body"`
     */
    variant?: TypographyVariant;
    /**
     * The text color. Use `muted` for secondary text, such as a date or a hint next to the main text. Muted text
     * has enough contrast on the page background and on surfaces, but not on tinted backgrounds.
     *
     * @defaultValue `"default"`
     */
    tone?: TypographyTone;
    /** The text. */
    children: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /**
     * Replaces the element while keeping the text style: `<h2 />` when a heading's level differs from its
     * style, or `<label htmlFor="email" />` to label a control. A function receives the props to spread and
     * the owner state.
     */
    render?: useRender.RenderProp<TypographyOwnerState>;
    /** A ref to the rendered element. */
    ref?: Ref<HTMLElement>;
}

/**
 * Shows text in one of the theme's text styles, from a page's display title to a small overline.
 *
 * Pick the `variant` by the text's role in the page. Heading variants render `h1` to `h4`, which build the
 * outline that screen reader users navigate by, so keep their levels in order without skipping one. When a
 * heading has to look different from its level, for example a card title that is a section of the page,
 * choose the style with `variant` and the element with `render`: `<Typography variant="heading4" render={<h2 />}>`.
 *
 * The text has no margin: space it with the layout around it.
 *
 * @summary Text in the theme's display, heading, body, label and overline styles.
 * @experimental
 */
export function Typography({ variant = "body", tone = "default", className, render, ...restProps }: TypographyProps) {
    const ownerState: TypographyOwnerState = { variant, tone };

    return useRender({
        defaultTagName: defaultTagNames[variant],
        render,
        state: ownerState,
        props: { ...restProps, className: clsx(styles.root, className) },
    });
}
