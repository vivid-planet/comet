import { format } from "date-fns";
import * as React from "react";
import { useLocale } from "./LocaleContextProvider";

interface IProps {
    format: string;
    date: Date | number;
}
export const FormatLocalized: React.FunctionComponent<IProps> = ({ date, format: formatString }) => {
    const locale = useLocale();
    return <>{format(date, formatString, { locale })}</>;
};
