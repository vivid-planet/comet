"use client";
import { PageLayout } from "@src/layout/PageLayout";
import { createSitePath } from "@src/util/createSitePath";
import { Fragment } from "react";

import { type GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import styles from "./Breadcrumbs.module.scss";

export const Breadcrumbs = ({ scope, name, path, parentNodes }: GQLBreadcrumbsFragment) => {
    return (
        <PageLayout grid>
            {parentNodes.length > 0 && (
                <div className={styles.container}>
                    {parentNodes.map((parentNode) => (
                        <Fragment key={parentNode.path}>
                            <a
                                className={styles.link}
                                href={createSitePath({
                                    path: parentNode.path,
                                    scope: scope,
                                })}
                            >
                                {parentNode.name}
                            </a>

                            <span className={styles.divider} />
                        </Fragment>
                    ))}

                    <a
                        className={styles.link}
                        href={createSitePath({
                            path: path,
                            scope: scope,
                        })}
                    >
                        {name}
                    </a>
                </div>
            )}
        </PageLayout>
    );
};
