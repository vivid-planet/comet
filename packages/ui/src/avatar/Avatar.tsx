"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { clsx } from "clsx";
import type { CSSProperties } from "react";

import { Icon } from "../icon/Icon";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Avatar.module.css";

/** @experimental */
export type AvatarSize = "small" | "medium" | "large";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type AvatarOwnerState = {
    size: AvatarSize;
};

/** @experimental */
export interface AvatarSlotProps {
    /**
     * The `<img>` element that shows `src`, with `name` as its text alternative. Rendered only when the avatar has
     * a `src`. It stays hidden until the image has loaded.
     */
    image?: SlotProps<BaseAvatar.Image.Props, AvatarOwnerState>;
    /**
     * The initials, or a person icon for a name without a letter or digit, with the `img` role and `name` as
     * their accessible name; without a name, it has no role. Rendered while there is no image to show: without a
     * `src`, while the image loads, and when it fails to load. Its `children` replace the initials, for example
     * with another `Icon`.
     */
    fallback?: SlotProps<BaseAvatar.Fallback.Props, AvatarOwnerState>;
}

/** @experimental */
export interface AvatarProps extends Omit<BaseAvatar.Root.Props, "className" | "style" | "render" | "children"> {
    /**
     * The person's name, such as "Jane Doe". It is the text alternative of the image, and its initials, the first
     * letters of its first and last word, show when there is no image. A name without a letter or digit shows a
     * person icon instead. An empty name, such as of a user who hasn't entered one, shows the icon too and makes the
     * avatar decorative, so assistive technology skips it.
     */
    name: string;
    /** The URL of the person's picture. Without it, or while it loads or when it fails to load, the avatar shows the initials. */
    src?: string;
    /**
     * The diameter, the same as the height of a control of that size. Use `small` in dense lists and tables,
     * `large` for the person a page is about.
     *
     * @defaultValue `"medium"`
     */
    size?: AvatarSize;
    /** Added to the component's own classes on the outer element. */
    className?: string;
    /** Inline styles for the outer element. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `image` and `fallback`. As a function, it receives the owner state: `size`. Pass
     * the image's other attributes, such as `srcSet` or `loading="lazy"`, to `image`, or replace its element with an
     * optimized image component, such as Next.js's `Image`, through `render`.
     */
    slotProps?: AvatarSlotProps;
}

const initialPattern = /[\p{L}\p{N}]\p{M}*/u;

function initialsOf(name: string) {
    const words = name.split(/\s+/).filter((word) => word !== "");
    const initialWords = words.length > 1 ? [words[0], words[words.length - 1]] : words;

    return initialWords
        .map((word) => word.match(initialPattern)?.[0] ?? "")
        .join("")
        .toUpperCase();
}

/**
 * Shows a person, such as the signed-in user or the author of a comment, by their picture, or by the initials of
 * their name when there is no picture.
 *
 * The avatar names the person once for assistive technology: the image by its text alternative, the initials as
 * an image named `name`. Next to the visible name, as in a list of users, pass `aria-hidden`, so the name isn't
 * announced twice. To make the avatar a link or a button, wrap it in one with an accessible name.
 *
 * The image renders right away and loads in place, also in server-rendered HTML, with the initials showing
 * through until it has loaded. The props the component doesn't handle, such as `id` and `aria-*`, go to the outer
 * `<span>`.
 *
 * @summary A person's picture, with the initials of their name as the fallback.
 * @experimental
 */
export function Avatar({ name, src, size = "medium", className, slotProps, ...restProps }: AvatarProps) {
    const ownerState: AvatarOwnerState = { size };
    const initials = initialsOf(name);
    const hasName = name.trim() !== "";
    const accessibleName = hasName ? { role: "img", "aria-label": name } : {};

    return (
        <BaseAvatar.Root {...restProps} data-size={size} className={clsx(styles.root, className)}>
            <BaseAvatar.Fallback
                {...resolveSlotProps({
                    ownProps: { className: styles.fallback, ...accessibleName, children: initials === "" ? <Icon name="user" /> : initials },
                    slotProps: slotProps?.fallback,
                    ownerState,
                })}
            />
            {src ? (
                <BaseAvatar.Image
                    {...resolveSlotProps({
                        ownProps: { className: styles.image, src, alt: hasName ? name : "", keepMounted: true },
                        slotProps: slotProps?.image,
                        ownerState,
                    })}
                />
            ) : null}
        </BaseAvatar.Root>
    );
}
