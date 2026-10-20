import { generateMetadata as generateMetadataPage, Page } from "@src/documents/pages/Page";
import type { Metadata } from "@src/framework/metadata";
import type { PageContent } from "@src/framework/render";
import type { GQLPageTreeNodeScopeInput } from "@src/graphql.generated";

import { Link } from "./links/Link";

type DocumentProps = { pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput };

type DocumentType = {
    // Called as function instead of rendered as component, so that notFound() and redirect() can still change the response
    loadPage: (props: DocumentProps) => Promise<PageContent>;
    generateMetadata?: (props: DocumentProps) => Promise<Metadata>;
};

export const documentTypes: Record<string, DocumentType> = {
    Page: {
        loadPage: Page,
        generateMetadata: generateMetadataPage,
    },
    Link: {
        loadPage: Link,
    },
};
