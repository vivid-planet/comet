import { Locale } from "date-fns";
import * as enUS from "date-fns/locale/en-US";
import * as React from "react";

export default React.createContext<Locale>(enUS);
