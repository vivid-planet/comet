import { type GQLPredefinedPageType } from "@src/graphql.generated";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const predefinedPageLabels: Record<GQLPredefinedPageType, ReactNode> = {
    News: <FormattedMessage id="predefinedPages.news" defaultMessage="News" />,
};
