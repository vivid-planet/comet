"use client";
import { createSitePath } from "@src/util/createSitePath";
import Link from "next/link";
import { Fragment } from "react";

import { type GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import styles from "./Breadcrumbs.module.scss";

type BreadcrumbsProps = GQLBreadcrumbsFragment;
const Breadcrumbs = ({ scope, name, path, parentNodes }: BreadcrumbsProps) => {
    return (
        <div className={styles.gridRoot}>
            {parentNodes.length > 0 && (
                <div className={styles.container}>
                    {parentNodes.map((parentNode) => (
                        <Fragment key={parentNode.path}>
                            <Link
                                href={createSitePath({
                                    path: parentNode.path,
                                    scope: scope,
                                })}
                                className={styles.link}
                            >
                                {parentNode.name}
                            </Link>

                            <span className={styles.divider} />
                        </Fragment>
                    ))}

                    <Link
                        href={createSitePath({
                            path: path,
                            scope: scope,
                        })}
                        className={styles.link}
                    >
                        {name}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Breadcrumbs;
