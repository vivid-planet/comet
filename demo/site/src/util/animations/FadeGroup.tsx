import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

const breakpoints = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1600,
};

interface FadeGroupContextValue {
    visible: boolean;
    onVisible: () => void;
}

const FadeGroupContext = createContext<FadeGroupContextValue | null>(null);

export function useFadeGroup() {
    return useContext(FadeGroupContext);
}

type BreakpointKey = keyof typeof breakpoints;

function getDisabledRanges(disabledBreakpoints: BreakpointKey[]) {
    const keys = Object.keys(breakpoints) as BreakpointKey[];
    const sorted = [...disabledBreakpoints].sort((a, b) => breakpoints[a] - breakpoints[b]);
    const ranges: Array<[number, number]> = [];

    for (const breakpoint of sorted) {
        const idx = keys.indexOf(breakpoint);
        if (idx < keys.length - 1) {
            // Disable from this breakpoint up to the next one
            ranges.push([breakpoints[breakpoint], breakpoints[keys[idx + 1]]]);
        } else {
            // Last breakpoint: disable from its value to Infinity
            ranges.push([breakpoints[breakpoint], Infinity]);
        }
    }
    return ranges;
}

function isInDisabledRange(width: number, ranges: Array<[number, number]>) {
    return ranges.some(([min, max]) => width >= min && width < max);
}

export function FadeGroup({ children, disabledBreakpoints = [] }: { children: ReactNode; disabledBreakpoints?: BreakpointKey[] }) {
    const [visible, setVisible] = useState(false);
    const onVisible = useCallback(() => setVisible(true), []);
    const [disableFadeGroup, setDisableFadeGroup] = useState(false);

    useEffect(() => {
        function checkDisabledBreakpoints() {
            const width = window.innerWidth;
            const ranges = getDisabledRanges(disabledBreakpoints);
            setDisableFadeGroup(isInDisabledRange(width, ranges));
        }
        checkDisabledBreakpoints();
        window.addEventListener("resize", checkDisabledBreakpoints);
        return () => window.removeEventListener("resize", checkDisabledBreakpoints);
    }, [disabledBreakpoints]);

    if (disableFadeGroup) return <>{children}</>;

    return <FadeGroupContext.Provider value={{ visible, onVisible }}>{children}</FadeGroupContext.Provider>;
}
