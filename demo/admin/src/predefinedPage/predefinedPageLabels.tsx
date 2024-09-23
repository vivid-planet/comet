import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const predefinedPageLabels: Record<string, ReactNode> = {
    News: <FormattedMessage id="predefinedPages.news" defaultMessage="News" />,
};
