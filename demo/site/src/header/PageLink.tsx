import { Link, useRouter } from "@comet/site-cms";
import { LinkBlock } from "@src/blocks/LinkBlock";
import { GQLPageLinkFragment } from "@src/graphql.generated";
import { gql } from "graphql-request";
import * as React from "react";

const pageLinkFragment = gql`
    fragment PageLink on PageTreeNode {
        path
        documentType
        document {
            __typename
            ... on Link {
                content
            }
        }
    }
`;

interface Props {
    page: GQLPageLinkFragment;
    children: ((active: boolean) => React.ReactNode) | React.ReactNode;
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
            <Link href={page.path} passHref>
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
