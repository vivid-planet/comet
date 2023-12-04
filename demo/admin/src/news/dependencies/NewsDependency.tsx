import { gql } from "@apollo/client";
import { DamImageBlock, DependencyInterface } from "@comet/cms-admin";
import { createDependencyMethods } from "@comet/cms-admin/lib/dependencies/createDependencyMethods";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import { GQLNewsDependencyQuery } from "@src/news/dependencies/NewsDependency.generated";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const NewsDependency: DependencyInterface = {
    displayName: <FormattedMessage id="news.displayName" defaultMessage="News" />,
    ...createDependencyMethods({
        rootBlocks: { content: NewsContentBlock, image: DamImageBlock },
        prefixes: { content: "form/" },
        query: gql`
            query NewsDependency($id: ID!) {
                node: news(id: $id) {
                    id
                    content
                }
            }
        `,
        buildUrl: (id, data: GQLNewsDependencyQuery, { contentScopeUrl, blockUrl }) => {
            return `${contentScopeUrl}/structured-content/news/${id}/edit/${blockUrl}`;
        },
    }),
};
