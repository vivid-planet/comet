"use client";

import { useRender } from "@base-ui/react/use-render";
import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Card.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior. A card has no such
 * configuration, so it is empty: `slotProps` functions receive it to work like in the other components.
 *
 * @experimental
 */
export type CardOwnerState = Record<string, never>;

/** @experimental */
export interface CardSlotProps {
    /** The row at the top that holds `titleGroup` and `actions`. Rendered only when the card has a `title`, a `description` or `actions`. */
    header?: SlotProps<ElementSlotProps<"div">, CardOwnerState>;
    /** The element around `title` and `description`, which takes the header's width next to `actions`. */
    titleGroup?: SlotProps<ElementSlotProps<"div">, CardOwnerState>;
    /** The `<h2>` element that holds `title`. Replace it for another heading level, for example `{ render: <h3 /> }`. */
    title?: SlotProps<ElementSlotProps<"h2">, CardOwnerState>;
    /** The paragraph that holds `description`. */
    description?: SlotProps<ElementSlotProps<"p">, CardOwnerState>;
    /** The element around `actions`, at the end of the header. */
    actions?: SlotProps<ElementSlotProps<"div">, CardOwnerState>;
    /** The element around `children`, below the header. */
    body?: SlotProps<ElementSlotProps<"div">, CardOwnerState>;
}

/** @experimental */
export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
    /**
     * The title, which names what the card contains, for example "Billing address". It is a level 2 heading,
     * so screen reader users can jump between cards: choose another level with `slotProps.title.render` to fit
     * the page's outline, such as `<h3 />` for a card in a section.
     */
    title?: ReactNode;
    /** A sentence below the title that says what the content is or what it is used for. */
    description?: ReactNode;
    /**
     * Actions on the whole card at the end of the header, such as an "Edit" button. Keep them to one or two;
     * they move below the title and the description when the card is too narrow for both, as on a phone.
     */
    actions?: ReactNode;
    /**
     * The content below the header. The card doesn't lay it out: arrange several elements yourself, for
     * example fields in a column with `--dextinity-space-xl` between them.
     */
    children?: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the card. */
    style?: CSSProperties;
    /**
     * Replaces the outer element, a `<div>`, while keeping the style: `<form />` for a card that is a form,
     * `<li />` in a list of cards, or `<section aria-labelledby="…" />` for a card that is a landmark. A
     * function receives the props to spread and the owner state.
     */
    render?: useRender.RenderProp<CardOwnerState>;
    /** A ref to the rendered element. */
    ref?: Ref<HTMLElement>;
    /**
     * Props for the inner parts: `header`, `titleGroup`, `title`, `description`, `actions` and `body`. As a
     * function, it receives the owner state, which is empty.
     */
    slotProps?: CardSlotProps;
}

/**
 * A surface that groups related content on a page, such as a section of a form, the details of an order or a
 * list, so users can scan a page by its cards.
 *
 * Give a card a `title` that names its content, and a `description` where the content needs an explanation.
 * Put actions on the whole card, such as "Edit", into `actions`, and the content into `children`. Use one
 * card per topic and don't nest cards: group the content inside a card with headings instead.
 *
 * The props the component doesn't handle, such as `id` and `aria-*`, go to the outer element.
 *
 * @summary A surface with an optional title, description and actions that groups related content.
 * @experimental
 */
export function Card({ title, description, actions, className, render, slotProps, children, ...restProps }: CardProps) {
    const ownerState: CardOwnerState = {};
    const hasTitle = hasContent(title);
    const hasDescription = hasContent(description);
    const hasActions = hasContent(actions);

    return useRender({
        defaultTagName: "div",
        render,
        state: ownerState,
        props: {
            ...restProps,
            className: clsx(styles.root, className),
            children: (
                <>
                    {(hasTitle || hasDescription || hasActions) && (
                        <SlotElement
                            tagName="div"
                            {...resolveSlotProps({ ownProps: { className: styles.header }, slotProps: slotProps?.header, ownerState })}
                        >
                            {(hasTitle || hasDescription) && (
                                <SlotElement
                                    tagName="div"
                                    {...resolveSlotProps({
                                        ownProps: { className: styles.titleGroup },
                                        slotProps: slotProps?.titleGroup,
                                        ownerState,
                                    })}
                                >
                                    {hasTitle && (
                                        <SlotElement
                                            tagName="h2"
                                            {...resolveSlotProps({ ownProps: { className: styles.title }, slotProps: slotProps?.title, ownerState })}
                                        >
                                            {title}
                                        </SlotElement>
                                    )}
                                    {hasDescription && (
                                        <SlotElement
                                            tagName="p"
                                            {...resolveSlotProps({
                                                ownProps: { className: styles.description },
                                                slotProps: slotProps?.description,
                                                ownerState,
                                            })}
                                        >
                                            {description}
                                        </SlotElement>
                                    )}
                                </SlotElement>
                            )}
                            {hasActions && (
                                <SlotElement
                                    tagName="div"
                                    {...resolveSlotProps({ ownProps: { className: styles.actions }, slotProps: slotProps?.actions, ownerState })}
                                >
                                    {actions}
                                </SlotElement>
                            )}
                        </SlotElement>
                    )}
                    {hasContent(children) && (
                        <SlotElement
                            tagName="div"
                            {...resolveSlotProps({ ownProps: { className: styles.body }, slotProps: slotProps?.body, ownerState })}
                        >
                            {children}
                        </SlotElement>
                    )}
                </>
            ),
        },
    });
}
