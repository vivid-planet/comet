"use client";
import { PageLink } from "@src/layout/header/PageLink";

import { type GQLTopMenuPageTreeNodeFragment } from "./TopNavigation.fragment.generated";
import styles from "./TopNavigation.module.scss";

interface Props {
    data: GQLTopMenuPageTreeNodeFragment[];
}

export function TopNavigation({ data }: Props): JSX.Element {
    return (
        <ol className={styles.topLevelNavigation}>
            {data.map((item) => (
                <li key={item.id} className={styles.topLevelLinkContainer}>
                    <PageLink className={styles.link} page={item} activeClassName="active">
                        {item.name}
                    </PageLink>
                    {item.childNodes.length > 0 && (
                        <ol className={styles.subLevelNavigation}>
                            {item.childNodes.map((node) => (
                                <li key={node.id}>
                                    <PageLink className={styles.link} page={node} activeClassName="active">
                                        {node.name}
                                    </PageLink>
                                </li>
                            ))}
                        </ol>
                    )}
                </li>
            ))}
        </ol>
    );
}
