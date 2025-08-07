import { LinkBlock } from "@src/common/blocks/LinkBlock";
import { predefinedPagePaths } from "@src/documents/predefinedPages/predefinedPagePaths";
import { type GQLPredefinedPage } from "@src/graphql.generated";
import { gql } from "graphql-request";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode } from "react";

import { type GQLPageLinkFragment } from "./PageLink.generated";

const pageLinkFragment = gql`
    fragment PageLink on PageTreeNode {
        path
        documentType
        document {
            __typename
            ... on Link {
                content
            }
            ... on PredefinedPage {
                type
            }
        }
    }
`;

interface Props {
    page: GQLPageLinkFragment;
    children: ((active: boolean) => ReactNode) | ReactNode;
}

function PageLink({ page, children }: Props): JSX.Element | null {
    const router = useRouter();
    const active = router.asPath === page.path;

    if (page.documentType === "Link") {
        if (page.document === null || page.document.__typename !== "Link") {
            return null;
        }

        return <LinkBlock data={page.document.content}>{typeof children === "function" ? children(active) : children}</LinkBlock>;
    } else if (page.documentType === "Page") {
        return (
            <Link href={page.path} passHref legacyBehavior>
                {typeof children === "function" ? children(active) : children}
            </Link>
        );
    } else if (page.documentType === "PredefinedPage") {
        if (!page.document) {
            return null;
        }

        const type = (page.document as GQLPredefinedPage).type;

        return (
            <Link href={type && predefinedPagePaths[type] ? predefinedPagePaths[type] : ""} passHref>
                {typeof children === "function" ? children(active) : children}
            </Link>
        );
    } else {
        if (process.env.NODE_ENV === "development") {
            throw new Error(`Unknown documentType "${page.documentType}"`);
        }

        return null;
    }
}

export { PageLink, pageLinkFragment };
