import { gql } from "@apollo/client";
import { createDependencyMethods, DamImageBlock, DependencyInterface } from "@comet/cms-admin";
import { GQLNewsContentScope } from "@src/graphql.generated";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import { FormattedMessage } from "react-intl";

export const NewsDependency: DependencyInterface = {
    displayName: <FormattedMessage id="news.displayName" defaultMessage="News" />,
    ...createDependencyMethods({
        rootQueryName: "news",
        rootBlocks: { content: { block: NewsContentBlock, path: "/form" }, image: DamImageBlock },
        scopeFragment: gql`
            fragment NewsDependencyScope on NewsContentScope {
                domain
                language
            }
        `,
        basePath: ({ id, scope }) => {
            const newsScope = scope as GQLNewsContentScope;
            return `/${newsScope.domain}/${newsScope.language}/structured-content/news/${id}/edit`;
        },
    }),
};
