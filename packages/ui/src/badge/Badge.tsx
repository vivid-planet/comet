"use client";

import { useRender } from "@base-ui/react/use-render";
import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode, Ref } from "react";

import styles from "./Badge.module.css";

/** @experimental */
export type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type BadgeOwnerState = {
    tone: BadgeTone;
};

/** @experimental */
export interface BadgeProps extends HTMLAttributes<HTMLElement> {
    /**
     * The color, by what the status means: `success` for a completed or healthy state, such as "Published",
     * `warning` for one that needs attention, `danger` for an error or a destructive state, `primary` to
     * highlight, such as "New", and `neutral` for everything else, such as "Draft" or a category.
     *
     * @defaultValue `"neutral"`
     */
    tone?: BadgeTone;
    /** The text. It must name the status on its own, because not everyone can tell the colors apart. */
    children: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /**
     * Replaces the element while keeping the style, for example `<li />` in a list of categories. A function
     * receives the props to spread and the owner state.
     */
    render?: useRender.RenderProp<BadgeOwnerState>;
    /** A ref to the rendered element. */
    ref?: Ref<HTMLElement>;
}

/**
 * Labels a status or a category in a few words, such as "Published" or "Draft", next to the item it describes.
 *
 * The text must state the status: the color only supports it, because color alone doesn't reach everyone
 * (WCAG 1.4.1). A badge is static text. It isn't interactive, so don't put a link or button inside, and it
 * isn't announced when it changes, so tell users about a change they must notice in another way.
 *
 * @summary A short, colored label for a status or category.
 * @experimental
 */
export function Badge({ tone = "neutral", className, render, ...restProps }: BadgeProps) {
    const ownerState: BadgeOwnerState = { tone };

    return useRender({
        defaultTagName: "span",
        render,
        state: ownerState,
        props: { ...restProps, className: clsx(styles.root, className) },
    });
}
