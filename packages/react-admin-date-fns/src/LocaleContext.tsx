import { Locale } from "date-fns";
import { enUS } from "date-fns/locale";
import * as React from "react";

export const LocaleContext = React.createContext<Locale>(enUS);
