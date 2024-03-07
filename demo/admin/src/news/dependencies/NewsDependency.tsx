import { createDependencyMethods, DamImageBlock, DependencyInterface } from "@comet/cms-admin";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const NewsDependency: DependencyInterface = {
    displayName: <FormattedMessage id="news.displayName" defaultMessage="News" />,
    ...createDependencyMethods({
        rootQueryName: "news",
        rootBlocks: { content: { block: NewsContentBlock, path: "/form" }, image: { block: DamImageBlock } },
        basePath: ({ id }) => `/structured-content/news/${id}/edit`,
    }),
};
