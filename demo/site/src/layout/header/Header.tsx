"use client";

import { SvgUse } from "@src/common/helpers/SvgUse";
import Link from "next/link";
import { useIntl } from "react-intl";

import { PageLayout } from "../PageLayout";
import { DesktopMenu } from "./DesktopMenu";
import { type GQLHeaderFragment } from "./Header.fragment.generated";
import styles from "./Header.module.scss";
import { MobileMenu } from "./MobileMenu";
import { type GQLNavigationCallToActionButtonListFragment } from "./NavigationCallToActionButtonList.fragment.generated";

interface Props {
    header: GQLHeaderFragment;
    navigationCallToActionButtonList?: GQLNavigationCallToActionButtonListFragment | null;
}

export const Header = ({ header, navigationCallToActionButtonList }: Props) => {
    const intl = useIntl();

    return (
        <header>
            <PageLayout grid>
                <div className={styles.pageLayoutContent}>
                    <nav className={styles.root}>
                        <Link href="/" title={intl.formatMessage({ id: "header.logo.title", defaultMessage: "Comet DXP Logo" })}>
                            <SvgUse href="/assets/comet-logo.svg#root" />
                        </Link>
                        <DesktopMenu menu={header} navigationCallToActionButtonList={navigationCallToActionButtonList} />
                        <MobileMenu menu={header} navigationCallToActionButtonList={navigationCallToActionButtonList} />
                    </nav>
                </div>
            </PageLayout>
        </header>
    );
};
