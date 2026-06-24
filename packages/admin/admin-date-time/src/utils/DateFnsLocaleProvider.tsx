import type { Locale } from "date-fns";
import { createContext, useContext } from "react";

/**
 * @deprecated The date/time components in `@comet/admin` use MUI X's `LocalizationProvider` (with `AdapterDateFns`) for localization instead.
 */
export const DateFnsLocaleContext = createContext<Locale | undefined>(undefined);

/**
 * @deprecated The date/time components in `@comet/admin` use MUI X's `LocalizationProvider` (with `AdapterDateFns`) for localization instead.
 */
export const DateFnsLocaleProvider = DateFnsLocaleContext.Provider;

/**
 * @deprecated The date/time components in `@comet/admin` use MUI X's `LocalizationProvider` (with `AdapterDateFns`) for localization instead.
 */
export function useDateFnsLocale() {
    return useContext(DateFnsLocaleContext);
}
