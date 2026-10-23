import { Children, type ComponentProps, createContext, isValidElement, type ReactNode, useContext, useSyncExternalStore } from "react";

import { subscribeToStyleChanges } from "./styleChanges";
import styles from "./tokenTable.module.css";
import { tokenNamePattern } from "./tokenTables";

const IsTokenTableContext = createContext(false);

/**
 * Renders a Markdown table of the docs pages. A table whose first column is "Token" gets a "Value" column with
 * each token's value in the theme and color scheme picked in the toolbar, so the Markdown itself, which agents
 * read, stays free of values that depend on the theme.
 */
export function MdxTable(props: ComponentProps<"table">) {
    return (
        <IsTokenTableContext.Provider value={textOf(firstCell(props.children)).trim() === "Token"}>
            <table {...props} />
        </IsTokenTableContext.Provider>
    );
}

export function MdxTableRow(props: ComponentProps<"tr">) {
    const isTokenTable = useContext(IsTokenTableContext);
    const cells = Children.toArray(props.children).filter(isValidElement);

    if (!isTokenTable || cells.length === 0) {
        return <tr {...props} />;
    }

    if (cells[0].type === "th") {
        return (
            <tr {...props}>
                {props.children}
                <th>Value</th>
            </tr>
        );
    }

    const tokens = textOf(cells[0]).match(tokenNamePattern) ?? [];
    return (
        <tr {...props}>
            {props.children}
            <td className={styles.valueCell}>
                {tokens.map((token) => (
                    <TokenValue key={token} token={token} />
                ))}
            </td>
        </tr>
    );
}

function TokenValue({ token }: { token: string }) {
    const value = useSyncExternalStore(subscribeToStyleChanges, () => getComputedStyle(document.documentElement).getPropertyValue(token).trim());

    return (
        <span className={styles.value}>
            {isColor(value) && <span className={styles.swatch} style={{ background: `var(${token})` }} />}
            <span className={styles.valueText}>{value}</span>
        </span>
    );
}

function isColor(value: string) {
    return /^(#|rgb|hsl|oklch|linear-gradient)/.test(value);
}

function firstCell(node: ReactNode): ReactNode {
    const [firstChild] = Children.toArray(node);
    if (!isValidElement<{ children?: ReactNode }>(firstChild)) {
        return firstChild;
    }
    return firstChild.type === "th" || firstChild.type === "td" ? firstChild : firstCell(firstChild.props.children);
}

function textOf(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }
    return Children.toArray(node)
        .map((child) => (isValidElement<{ children?: ReactNode }>(child) ? textOf(child.props.children) : typeof child === "string" ? child : ""))
        .join("");
}
