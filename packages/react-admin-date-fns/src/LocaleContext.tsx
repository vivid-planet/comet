import { Locale } from "date-fns";
import * as enUS from "date-fns/locale/en-US";
import * as React from "react";

interface ILocaleContext extends Locale {
    localeName: string;
}

export const LocaleContext = React.createContext<ILocaleContext>({ ...enUS, localeName: "de" });
