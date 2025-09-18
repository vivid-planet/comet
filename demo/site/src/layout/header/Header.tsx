"use client";

import { SvgUse } from "@src/common/helpers/SvgUse";
import Link from "next/link";

import { PageLayout } from "../PageLayout";
import { DesktopMenu } from "./DesktopMenu";
import { type GQLHeaderFragment } from "./Header.fragment.generated";
import styles from "./Header.module.scss";
import { MobileMenu } from "./MobileMenu";

interface Props {
    header: GQLHeaderFragment;
}

export const Header = ({ header }: Props) => {
    return (
        <header>
            <PageLayout grid>
                <div className={styles.pageLayoutContent}>
                    <nav className={styles.root}>
                        <Link href="/">
                            <SvgUse href="/assets/comet-logo.svg#root" />
                        </Link>
                        <DesktopMenu menu={header} />
                        <MobileMenu menu={header} />
                    </nav>
                </div>
            </PageLayout>
        </header>
    );
};
