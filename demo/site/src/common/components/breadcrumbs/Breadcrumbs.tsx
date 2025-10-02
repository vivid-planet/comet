"use client";
import { SvgUse } from "@src/common/helpers/SvgUse";
import { PageLayout } from "@src/layout/PageLayout";
import { createSitePath } from "@src/util/createSitePath";
import NextLink from "next/link";

import { type GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import styles from "./Breadcrumbs.module.scss";
import { MobileBreadcrumbs } from "./MobileBreadcrumbs";

export const Breadcrumbs = ({ scope, name, path, parentNodes }: GQLBreadcrumbsFragment) => {
    return (
        <>
            <PageLayout grid>
                {parentNodes.length > 0 && (
                    <ol className={styles.container}>
                        {parentNodes.map((parentNode) => (
                            <li key={parentNode.path} className={styles.listElement}>
                                <NextLink
                                    className={styles.link}
                                    href={createSitePath({
                                        path: parentNode.path,
                                        scope: scope,
                                    })}
                                >
                                    {parentNode.name}
                                </NextLink>
                                <SvgUse href="/assets/icons/chevron-down.svg#root" className={styles.chevron} width={16} height={16} />
                            </li>
                        ))}
                        <li className={styles.listElement}>
                            <NextLink
                                className={styles.link}
                                href={createSitePath({
                                    path: path,
                                    scope: scope,
                                })}
                            >
                                {name}
                            </NextLink>
                        </li>
                    </ol>
                )}
            </PageLayout>
            <MobileBreadcrumbs breadcrumbs={{ scope, name, path, parentNodes }} />
        </>
    );
};
