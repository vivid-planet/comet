"use client";

import { type GQLHeaderFragment } from "./Header.fragment.generated";
import styles from "./Header.module.scss";
import { PageLink } from "./PageLink";

interface Props {
    header: GQLHeaderFragment;
}

function Header({ header }: Props): JSX.Element {
    return (
        <header className={styles.root}>
            <nav>
                <ol className={styles.topLevelNavigation}>
                    {header.items.map((item) => (
                        <li key={item.id} className={styles.topLevelLinkContainer}>
                            <PageLink className={styles.link} page={item.node} activeClassName="active">
                                {item.node.name}
                            </PageLink>
                            {item.node.childNodes.length > 0 && (
                                <ol className={styles.subLevelNavigation}>
                                    {item.node.childNodes.map((node) => (
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
            </nav>
        </header>
    );
}

export { Header };
