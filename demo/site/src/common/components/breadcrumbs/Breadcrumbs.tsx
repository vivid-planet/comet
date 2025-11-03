"use client";
import { SvgUse } from "@src/common/helpers/SvgUse";
import { PageLayout } from "@src/layout/PageLayout";
import { createSitePath } from "@src/util/createSitePath";
import clsx from "clsx";
import NextLink from "next/link";
import { useId, useState } from "react";
import ReactFocusLock from "react-focus-lock";
import { FormattedMessage, useIntl } from "react-intl";

import { type GQLBreadcrumbsFragment } from "./Breadcrumbs.fragment.generated";
import styles from "./Breadcrumbs.module.scss";

export const Breadcrumbs = ({ scope, name, path, parentNodes }: GQLBreadcrumbsFragment) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const intl = useIntl();
    const contentId = useId();

    return (
        <PageLayout grid className={styles.root}>
            <button
                className={styles.mobileHomeButton}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
            >
                {name}
                <SvgUse
                    className={clsx(styles.mobileChevron, isExpanded && styles.mobileChevronExpanded)}
                    href="/assets/icons/chevron-down.svg#root"
                    width={16}
                    height={16}
                />
            </button>
            {parentNodes.length > 0 && (
                <ReactFocusLock className={clsx(styles.listContainer, isExpanded && styles.listContainerExpanded)} disabled={!isExpanded}>
                    <ol className={styles.list} id={contentId}>
                        <li className={styles.mobileNavigationListElements}>
                            <button
                                className={styles.mobileBackButton}
                                aria-label={intl.formatMessage({
                                    id: "header.closeButton.arialLabel",
                                    defaultMessage: "Close Breadcrumbs",
                                })}
                                onClick={() => setIsExpanded(false)}
                            >
                                <SvgUse href="/assets/icons/arrow-left.svg#root" width={16} height={16} color="inherit" />
                                <FormattedMessage id="header.closeBreadcrumbs" defaultMessage="Close Breadcrumbs" />
                            </button>
                        </li>
                        <li className={clsx(styles.mobileNavigationListElements, styles.linkContainer)}>
                            <NextLink className={styles.link} href={createSitePath({ path: "/", scope: scope })}>
                                <FormattedMessage id="header.breadcrumbs.home" defaultMessage="Home" />
                            </NextLink>
                        </li>
                        {parentNodes.map((parentNode) => (
                            <li key={parentNode.path} className={clsx(styles.listElement, isExpanded && styles.linkContainer)}>
                                <SvgUse
                                    href="/assets/icons/corner-down-right.svg#root"
                                    className={clsx(styles.mobileCornerDownRightIcon, styles.linkActive)}
                                    width={16}
                                    height={16}
                                />
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
                        <li className={clsx(styles.listElement, isExpanded && styles.linkContainer)}>
                            <SvgUse
                                href="/assets/icons/corner-down-right.svg#root"
                                className={clsx(styles.mobileCornerDownRightIcon, styles.linkActive)}
                                width={16}
                                height={16}
                            />
                            <NextLink
                                className={clsx(styles.link, styles.linkActive)}
                                href={createSitePath({
                                    path: path,
                                    scope: scope,
                                })}
                            >
                                {name}
                            </NextLink>
                        </li>
                    </ol>
                </ReactFocusLock>
            )}
        </PageLayout>
    );
};
