import { type GQLPageTreeNodeScopeInput } from "@src/graphql.generated";
import type { PublicSiteConfig } from "@src/site-configs";

import { Layout } from "./Layout";
import { NotFoundClient } from "./NotFoundClient";

interface NotFoundProps {
    language: string;
    siteConfig: PublicSiteConfig;
}

export async function NotFound(props: NotFoundProps) {
    const language = props.siteConfig.scope.languages.includes(props.language) ? props.language : "en";
    const scope: GQLPageTreeNodeScopeInput = {
        domain: props.siteConfig.scope.domain,
        language,
    };

    return (
        <Layout scope={scope}>
            <NotFoundClient />
        </Layout>
    );
}
