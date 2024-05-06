import { Link } from "./Link";
import { generateMetadata as generateMetadataPage, Page } from "./Page";

// TODO fix type for async component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DocumentType = any; //{ component: React.ComponentType<{ pageTreeNodeId: string; scope: GQLPageTreeNodeScopeInput }> };

export const documentTypes: Record<string, DocumentType> = {
    Page: {
        component: Page,
        generateMetadata: generateMetadataPage,
    },
    Link: {
        component: Link,
    },
};
