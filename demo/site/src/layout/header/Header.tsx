"use client";

import { SvgUse } from "@src/common/helpers/SvgUse";
import Link from "next/link";
import styled from "styled-components";

import { PageLayout } from "../PageLayout";
import { DesktopMenu } from "./DesktopMenu";
import { type GQLHeaderFragment } from "./Header.fragment.generated";
import { MobileMenu } from "./MobileMenu";

interface Props {
    header: GQLHeaderFragment;
}

function Header({ header }: Props): JSX.Element {
    return (
        <header>
            <PageLayout grid>
                <PageLayoutContent>
                    <Root>
                        <Link href="/">
                            <SvgUse href="/assets/comet-logo.svg#root" />
                        </Link>
                        <DesktopMenu header={header} />
                        <MobileMenu header={header} />
                    </Root>
                </PageLayoutContent>
            </PageLayout>
        </header>
    );
}

const PageLayoutContent = styled.div`
    grid-column: 2 / -2;
`;

const Root = styled.div`
    display: flex;
    height: var(--header-height);
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.palette.gray["200"]};
`;

export { Header };
