"use client";

import { useRender } from "@base-ui/react/use-render";
import type { JSX } from "react";

type TagName = keyof JSX.IntrinsicElements;

/**
 * The props of a slot that renders a plain element: the element's props plus `render`.
 *
 * @experimental
 */
export type ElementSlotProps<Tag extends TagName> = useRender.ComponentProps<Tag>;

type SlotElementProps<Tag extends TagName> = ElementSlotProps<Tag> & {
    tagName: Tag;
};

/**
 * Renders a slot that is a plain element, so a consumer can replace it through `render`.
 */
export function SlotElement<Tag extends TagName>({ tagName, render, ...props }: SlotElementProps<Tag>) {
    return useRender({ defaultTagName: tagName, render, props });
}
