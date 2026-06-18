import { createCometTheme } from "@comet/admin";

export const createTheme = (muiLocale: object[]) => createCometTheme({}, ...muiLocale);
