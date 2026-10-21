import { Page } from "@src/documents/pages/Page";
import type { PageContent } from "@src/framework/render";
import type { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";

import { Link } from "./links/Link";

type DocumentProps = { pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput };

type DocumentType = {
    // Called as function instead of rendered as component, so that notFound() and redirect() can still change the response
    loadPage: (props: DocumentProps) => Promise<PageContent>;
};

export const documentTypes: Record<string, DocumentType> = {
    Page: {
        loadPage: Page,
    },
    Link: {
        loadPage: Link,
    },
};
