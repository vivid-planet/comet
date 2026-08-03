import type { ReactNode } from "react";

export type BlockTextMarkRenderer = (children: ReactNode, options: { key: string }) => ReactNode;

export const builtInBlockTextMarkRenderers: Record<"bold" | "italic" | "strike" | "superscript" | "subscript", BlockTextMarkRenderer> = {
    // The explicit styles back up the semantic tags in rendering engines that don't apply their default styling.
    bold: (children, { key }) => (
        <strong key={key} style={{ fontWeight: "bold" }}>
            {children}
        </strong>
    ),
    italic: (children, { key }) => (
        <em key={key} style={{ fontStyle: "italic" }}>
            {children}
        </em>
    ),
    strike: (children, { key }) => <s key={key}>{children}</s>,
    superscript: (children, { key }) => <sup key={key}>{children}</sup>,
    subscript: (children, { key }) => <sub key={key}>{children}</sub>,
};
