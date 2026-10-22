import { clsx } from "clsx";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";

import styles from "./AppBar.module.css";

/** @experimental */
export interface AppBarProps extends ComponentPropsWithRef<"header"> {
    /**
     * The bar's content, side by side from the start: `AppBarButton`, `AppBarIconButton` and `Menu` elements,
     * the product's name or logo, and an `AppBarSpacer` before the content that belongs at the end.
     */
    children?: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the `<header>`. */
    style?: CSSProperties;
}

/**
 * The bar at the top of an application, which holds what every page needs: the button that opens the
 * navigation, the product's name or logo, application-wide actions and the user menu. Use one per page.
 *
 * Put `AppBarButton` and `AppBarIconButton` elements into it, with a `Menu` for actions that need more room,
 * such as the user menu. The children sit side by side, vertically centered; an `AppBarSpacer` fills the free
 * space and pushes what follows it to the end. The bar doesn't wrap its children, and scrolls sideways when they
 * don't fit: on small screens, show fewer of them, for example only icon buttons.
 *
 * It renders a `<header>` element, which screen readers announce as the page's banner while it isn't inside
 * a sectioning element such as `<main>`. The bar doesn't position itself: keep it at the top while scrolling
 * through the application's layout, for example with `position: sticky` in a class.
 *
 * The props the component doesn't handle, such as `id` and `aria-*`, go to the `<header>`.
 *
 * @summary The bar at the top of an application, with its name, actions and user menu.
 * @experimental
 */
export function AppBar({ className, ...headerProps }: AppBarProps) {
    return <header {...headerProps} className={clsx(styles.root, className)} />;
}
