import { Breakpoint, BreakpointsOptions } from "@mui/system/createTheme/createBreakpoints";

export const breakpointValues: { [key in Breakpoint]: number } = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
};

export const breakpointsOptions: BreakpointsOptions = {
    values: breakpointValues,
};
