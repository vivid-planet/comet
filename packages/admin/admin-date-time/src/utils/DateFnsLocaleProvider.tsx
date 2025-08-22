import { type Locale } from "date-fns";
import { createContext, useContext } from "react";

export const DateFnsLocaleContext = createContext<Locale | undefined>(undefined);

export const DateFnsLocaleProvider = DateFnsLocaleContext.Provider;

export function useDateFnsLocale() {
    return useContext(DateFnsLocaleContext);
}
