import { format } from "date-fns";
import * as React from "react";
import { LocaleContext } from "./LocaleContext";

interface IProps {
    format: string;
    date: Date | number;
}
export const FormatLocalized: React.FunctionComponent<IProps> = ({ date, format: formatString }) => {
    const locale = React.useContext(LocaleContext);
    return <>{format(date, formatString, { locale })}</>;
};
