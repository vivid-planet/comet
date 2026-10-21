import { CodeOrSourceMdx } from "@storybook/addon-docs/blocks";
import { type ComponentProps, useSyncExternalStore } from "react";

import { subscribeToStyleChanges } from "./styleChanges";
import styles from "./tokenCode.module.css";

const tokenPattern = /^--dextinity-[a-z0-9-]+$/;

/**
 * Renders Markdown code like Storybook does, and adds the current value to an inline code span that names a
 * design token, so the tables of design tokens show the values of the theme picked in the toolbar.
 */
export function TokenCode(props: ComponentProps<typeof CodeOrSourceMdx>) {
    const { children, className } = props;

    if (className !== undefined || typeof children !== "string" || !tokenPattern.test(children)) {
        return <CodeOrSourceMdx {...props} />;
    }

    return (
        <span className={styles.token}>
            <CodeOrSourceMdx {...props} />
            <TokenValue token={children} />
        </span>
    );
}

function TokenValue({ token }: { token: string }) {
    const value = useSyncExternalStore(subscribeToStyleChanges, () => getComputedStyle(document.documentElement).getPropertyValue(token).trim());

    if (value === "") {
        return null;
    }

    return (
        <span className={styles.value}>
            {isColor(value) && <span className={styles.swatch} style={{ background: `var(${token})` }} />}
            {value}
        </span>
    );
}

function isColor(value: string) {
    return /^(#|rgb|hsl|oklch|linear-gradient)/.test(value);
}
