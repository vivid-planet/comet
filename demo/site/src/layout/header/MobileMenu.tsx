"use client";
import { SvgUse } from "@src/common/helpers/SvgUse";
import { PageLink } from "@src/layout/header/PageLink";
import { PageLayout } from "@src/layout/PageLayout";
import { useEscapeKeyPressed } from "@src/util/useEscapeKeyPressed";
import { useState } from "react";
import FocusLock from "react-focus-lock";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";

import { type GQLMobileMenuFragment } from "./MobileMenu.fragment.generated";

interface Props {
    menu: GQLMobileMenuFragment;
}

export const MobileMenu = ({ menu }: Props) => {
    const intl = useIntl();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [expandedSubLevelNavigation, setExpandedSubLevelNavigation] = useState<string | null>(null);

    const handleMenuButtonClick = () => {
        if (isMenuOpen) {
            setExpandedSubLevelNavigation(null);
            setIsMenuOpen(false);
        } else {
            setIsMenuOpen(true);
        }
    };

    const handleSubLevelNavigationButtonClick = (id: string) => {
        if (expandedSubLevelNavigation === id) {
            setExpandedSubLevelNavigation(null);
        } else {
            setExpandedSubLevelNavigation(id);
        }
    };

    useEscapeKeyPressed(() => {
        if (expandedSubLevelNavigation !== null) {
            setExpandedSubLevelNavigation(null);
        } else {
            setIsMenuOpen(false);
        }
    });

    return (
        <Root>
            <MenuButton
                aria-label={intl.formatMessage({
                    id: "header.menu.arialLabel",
                    defaultMessage: "Menu",
                })}
                aria-expanded={isMenuOpen}
                onClick={handleMenuButtonClick}
            >
                <SvgUse
                    href={isMenuOpen ? "/assets/icons/menu-open.svg#root" : "/assets/icons/menu.svg#root"}
                    width={16}
                    height={16}
                    color="inherit"
                />
            </MenuButton>
            <MenuContainer $isMenuOpen={isMenuOpen} aria-hidden={!isMenuOpen}>
                <PageLayout grid>
                    <PageLayoutContent>
                        <nav>
                            <FocusLock>
                                <TopLevelNavigation>
                                    <li>
                                        <BackButton
                                            aria-label={intl.formatMessage({
                                                id: "header.closeButton.arialLabel",
                                                defaultMessage: "Close Menu",
                                            })}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <SvgUse href="/assets/icons/arrow-left.svg#root" width={16} height={16} color="inherit" />
                                            <FormattedMessage id="header.closeMenu" defaultMessage="Close Menu" />
                                        </BackButton>
                                    </li>
                                    {menu.items.map((node) => {
                                        return (
                                            <li key={node.id}>
                                                {node.node.childNodes.length > 0 ? (
                                                    <ButtonLink
                                                        aria-label={intl.formatMessage(
                                                            {
                                                                id: "header.subMenu.arialLabel",
                                                                defaultMessage: "Submenu of {name}",
                                                            },
                                                            { name: node.node.name },
                                                        )}
                                                        aria-expanded={expandedSubLevelNavigation === node.id}
                                                        onClick={() => handleSubLevelNavigationButtonClick(node.id)}
                                                    >
                                                        {node.node.name}
                                                        <SvgUse href="/assets/icons/arrow-right.svg#root" width={16} height={16} color="inherit" />
                                                    </ButtonLink>
                                                ) : (
                                                    <Link page={node.node}>{node.node.name}</Link>
                                                )}
                                                {node.node.childNodes.length > 0 && (
                                                    <FocusLock disabled={expandedSubLevelNavigation !== node.id}>
                                                        <SubLevelNavigation $isExpanded={expandedSubLevelNavigation === node.id}>
                                                            <PageLayout grid>
                                                                <PageLayoutContent>
                                                                    <li>
                                                                        <BackButton
                                                                            aria-label={intl.formatMessage({
                                                                                id: "header.backButton.arialLabel",
                                                                                defaultMessage: "Go back",
                                                                            })}
                                                                            onClick={() => setExpandedSubLevelNavigation(null)}
                                                                        >
                                                                            <SvgUse
                                                                                href="/assets/icons/arrow-left.svg#root"
                                                                                width={16}
                                                                                height={16}
                                                                                color="inherit"
                                                                            />
                                                                            <FormattedMessage id="header.back" defaultMessage="Back" />
                                                                        </BackButton>
                                                                    </li>
                                                                    <li>
                                                                        <OverviewButton page={node.node}>
                                                                            <SvgUse
                                                                                href="/assets/icons/overview.svg#root"
                                                                                width={16}
                                                                                height={16}
                                                                                color="inherit"
                                                                            />
                                                                            <FormattedMessage id="header.overview" defaultMessage="Overview" />
                                                                            <span aria-hidden="true"> | </span>
                                                                            {node.node.name}
                                                                        </OverviewButton>
                                                                    </li>
                                                                    {node.node.childNodes.map((node) => (
                                                                        <li key={node.id}>
                                                                            <Link page={node}>{node.name}</Link>
                                                                        </li>
                                                                    ))}
                                                                </PageLayoutContent>
                                                            </PageLayout>
                                                        </SubLevelNavigation>
                                                    </FocusLock>
                                                )}
                                            </li>
                                        );
                                    })}
                                </TopLevelNavigation>
                            </FocusLock>
                        </nav>
                    </PageLayoutContent>
                </PageLayout>
            </MenuContainer>
        </Root>
    );
};

const Root = styled.div`
    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        display: none;
    }
`;

const PageLayoutContent = styled.div`
    grid-column: 2 / -2;
`;

const MenuButton = styled.button`
    appearance: none;
    border: none;
    background-color: transparent;
    color: inherit;
    padding: 0;
    width: 24px;
    height: 24px;
`;

const MenuContainer = styled.div<{ $isMenuOpen: boolean }>`
    display: block;
    position: fixed;
    top: var(--header-height);
    left: 0;
    height: 0;
    width: 100vw;
    z-index: 40;
    background-color: ${({ theme }) => theme.palette.gray["200"]};
    overflow: auto;
    visibility: hidden;
    transition:
        height 0.15s ease-out,
        visibility 0s linear 0.15s;

    ${({ $isMenuOpen }) =>
        $isMenuOpen &&
        css`
            visibility: visible;
            height: calc(var(--full-viewport-height) - var(--header-height));
            transition: height 0.25s ease-in;
        `}
`;

const TopLevelNavigation = styled.ol`
    list-style-type: none;
    padding: 0;
    margin: 0;
`;

const SubLevelNavigation = styled.ol<{ $isExpanded: boolean }>`
    list-style-type: none;
    position: fixed;
    top: var(--header-height);
    left: 0;
    height: calc(var(--full-viewport-height) - var(--header-height));
    width: 100vw;
    background-color: ${({ theme }) => theme.palette.gray["200"]};
    padding: 0;
    overflow: auto;
    visibility: hidden;
    transform: translateX(100%);
    transition:
        transform 0.2s ease-out,
        visibility 0s linear 0.2s;

    ${({ $isExpanded }) =>
        $isExpanded &&
        css`
            visibility: visible;
            transform: translateX(0);
            transition: transform 0.2s ease-in;
        `}
`;

const Link = styled(PageLink)`
    width: 100%;
    text-decoration: none;
    display: inline-block;
    padding: ${({ theme }) => theme.spacing.S500} 0;
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.palette.text.primary};

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        &:hover {
            color: ${({ theme }) => theme.palette.primary.main};
        }
    }
`;

const ButtonLinkBase = styled.button`
    appearance: none;
    border: none;
    background-color: transparent;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: ${({ theme }) => theme.spacing.S500} 0;
    gap: ${({ theme }) => theme.spacing.S200};

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        &:hover {
            color: ${({ theme }) => theme.palette.primary.main};
        }
    }
`;

const ButtonLink = styled(ButtonLinkBase)`
    justify-content: space-between;
`;

const BackButton = styled(ButtonLinkBase)`
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.palette.gray["300"]};
`;

const OverviewButton = styled(PageLink)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.S200};
    width: 100%;
    padding: ${({ theme }) => theme.spacing.S500} 0;
    text-decoration: none;
    color: ${({ theme }) => theme.palette.text.primary};

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        &:hover {
            color: ${({ theme }) => theme.palette.primary.main};
        }
    }
`;
