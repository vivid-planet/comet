"use client";
import { PageLink } from "@src/layout/header/PageLink";

import { type GQLTopMenuPageTreeNodeFragment } from "./TopNavigation.fragment.generated";
import styles from "./TopNavigation.module.scss";

interface Props {
    data: GQLTopMenuPageTreeNodeFragment[];
}

export const TopNavigation = ({ data }: Props) => {
    return (
        <ol className={styles.topLevelNavigation}>
            {data.map((item) => (
                <li className={styles.topLevelLinkContainer} key={item.id}>
                    <PageLink page={item} activeClassName={styles.active} className={styles.link}>
                        {item.name}
                    </PageLink>
                    {item.childNodes.length > 0 && (
                        <ol className={styles.subLevelNavigation}>
                            {item.childNodes.map((node) => (
                                <li key={node.id}>
                                    <PageLink page={node} activeClassName={styles.active} className={styles.link}>
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
};
