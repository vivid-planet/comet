import type { ReactNode } from "react";

/**
 * Whether a node renders something. `null`, `undefined`, booleans and `""` don't, so a part isn't rendered for
 * `condition && <Icon />` when the condition is false.
 */
export function hasContent(node: ReactNode): boolean {
    return node != null && typeof node !== "boolean" && node !== "";
}
