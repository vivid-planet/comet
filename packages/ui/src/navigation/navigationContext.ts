"use client";

import { createContext } from "react";

interface NavigationContextValue {
    /** The level of the entries in this part of the navigation: `1` directly in `Navigation`, one more inside each `NavigationGroup`. */
    level: number;
    /** Opens the enclosing groups, so that the active item is visible. Absent outside a group. */
    revealActiveItem: (() => void) | undefined;
}

/**
 * Where an entry of a `Navigation` sits, so that items and groups can indent themselves and open the groups
 * around the active item.
 */
export const NavigationContext = createContext<NavigationContextValue>({ level: 1, revealActiveItem: undefined });
