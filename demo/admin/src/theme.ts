import { createCometTheme } from "@dextinity/admin";

export const createTheme = (muiLocale: object[]) => createCometTheme({}, ...muiLocale);
