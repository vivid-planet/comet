import { JsonLd } from "@comet/site-nextjs";
import { createSitePath } from "@src/util/createSitePath";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import type { BreadcrumbList, WithContext } from "schema-dts";

import type { GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import { BreadcrumbsClient } from "./BreadcrumbsClient";

export const Breadcrumbs = (props: GQLBreadcrumbsFragment) => {
    const { scope, name, parentNodes } = props;
    const baseUrl = getSiteConfigForDomain(scope.domain).url;
    const absoluteUrl = (nodePath: string) => `${baseUrl}${createSitePath({ path: nodePath, scope })}`;

    const breadcrumbList: WithContext<BreadcrumbList> = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            ...parentNodes.map((node, index) => ({
                "@type": "ListItem" as const,
                position: index + 1,
                name: node.name,
                item: absoluteUrl(node.path),
            })),
            {
                "@type": "ListItem" as const,
                position: parentNodes.length + 1,
                name,
            },
        ],
    };

    return (
        <>
            <JsonLd<BreadcrumbList> data={breadcrumbList} />
            <BreadcrumbsClient {...props} />
        </>
    );
};
