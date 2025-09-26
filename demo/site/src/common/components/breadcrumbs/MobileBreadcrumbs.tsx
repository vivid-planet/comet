"use client";

import { SvgUse } from "@src/common/helpers/SvgUse";
import { PageLayout } from "@src/layout/PageLayout";
import { createSitePath } from "@src/util/createSitePath";
import { useEscapeKeyPressed } from "@src/util/useEscapeKeyPressed";
import clsx from "clsx";
import Link from "next/link";
import { useId, useState } from "react";
import ReactFocusLock from "react-focus-lock";
import { FormattedMessage, useIntl } from "react-intl";

import { type GQLMobileBreadcrumbsFragment } from "./MobileBreadcrumbs.fragment.generated";
import styles from "./MobileBreadcrumbs.module.scss";

interface Props {
    breadcrumbs: GQLMobileBreadcrumbsFragment;
}

export const MobileBreadcrumbs = ({ breadcrumbs }: Props) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const intl = useIntl();
    const contentId = useId();

    useEscapeKeyPressed(() => {
        setIsExpanded(false);
    });

    return (
        <div className={styles.root}>
            <PageLayout grid>
                <button className={styles.button} onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded} aria-controls={contentId}>
                    {breadcrumbs.name}
                    <SvgUse
                        className={clsx(styles.chevron, isExpanded && styles.chevronExpanded)}
                        href="/assets/icons/chevron-down.svg#root"
                        width={16}
                        height={16}
                    />
                </button>
            </PageLayout>
            {isExpanded && (
                <ReactFocusLock className={clsx(styles.dropdown, isExpanded && styles.dropdownExpanded)}>
                    <ol className={styles.list} id={contentId}>
                        <li>
                            <button
                                className={styles.backButton}
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
                        <li className={styles.linkContainer}>
                            <Link className={styles.link} href="/">
                                <FormattedMessage id="header.breadcrumbs.home" defaultMessage="Home" />
                            </Link>
                        </li>
                        {breadcrumbs.parentNodes.map((parentNode) => (
                            <li key={parentNode.path} className={styles.linkContainer}>
                                <SvgUse href="/assets/icons/corner-down-right.svg#root" className={styles.cornerDownRight} width={16} height={16} />
                                <a
                                    className={styles.link}
                                    href={createSitePath({
                                        path: parentNode.path,
                                        scope: breadcrumbs.scope,
                                    })}
                                >
                                    {parentNode.name}
                                </a>
                            </li>
                        ))}
                        <li className={styles.linkContainer}>
                            <SvgUse
                                href="/assets/icons/corner-down-right.svg#root"
                                className={clsx(styles.cornerDownRight, styles.linkActive)}
                                width={16}
                                height={16}
                            />
                            <Link
                                className={clsx(styles.link, styles.linkActive)}
                                href={createSitePath({
                                    path: breadcrumbs.path,
                                    scope: breadcrumbs.scope,
                                })}
                            >
                                {breadcrumbs.name}
                            </Link>
                        </li>
                    </ol>
                </ReactFocusLock>
            )}
        </div>
    );
};
