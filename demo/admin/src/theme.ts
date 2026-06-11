import { createCometTheme } from "@comet/admin";

import { getLanguageConfig } from "./lang";

export const theme = createCometTheme({}, ...getLanguageConfig().muiLocale);
