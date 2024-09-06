import { Breakpoint } from "@mui/material";

type BreakpointKey = Breakpoint | number;

// Mimic the object for breakpoint functions from MUIs theme
type Breakpoints = {
    up: (key: BreakpointKey) => string;
    down: (key: BreakpointKey) => string;
    between: (start: BreakpointKey, end: BreakpointKey) => string;
    only: (key: Breakpoint) => string;
    not: (key: Breakpoint) => string;
};

const renderKey = (key: BreakpointKey) => (typeof key === "number" ? key : `"${key}"`);

const breakpoints: Breakpoints = {
    up: (key) => `theme.breakpoints.up(${renderKey(key)})`,
    down: (key) => `theme.breakpoints.down(${renderKey(key)})`,
    between: (start, end) => `theme.breakpoints.between(${renderKey(start)}, ${renderKey(end)})`,
    only: (key) => `theme.breakpoints.only(${renderKey(key)})`,
    not: (key) => `theme.breakpoints.not(${renderKey(key)})`,
};

export type ColumnVisibleOption = string | ((breakpoints: Breakpoints) => string);

export const getColumnVisibleValue = (visible?: ColumnVisibleOption) => {
    if (!visible) {
        return undefined;
    }

    if (typeof visible === "string") {
        return `"${visible}"`;
    }

    return visible(breakpoints);
};
