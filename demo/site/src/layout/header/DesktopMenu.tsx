"use client";
import { SvgUse } from "@src/common/helpers/SvgUse";
import { PageLink } from "@src/layout/header/PageLink";
import { useEscapeKeyPressed } from "@src/util/useEscapeKeyPressed";
import { useId, useState } from "react";
import FocusLock from "react-focus-lock";
import { useIntl } from "react-intl";
import styled from "styled-components";

import { type GQLDesktopMenuFragment } from "./DesktopMenu.fragment.generated";

interface Props {
    menu: GQLDesktopMenuFragment;
}

export const DesktopMenu = ({ menu }: Props) => {
    const intl = useIntl();
    const [expandedSubLevelNavigation, setExpandedSubLevelNavigation] = useState<string | null>(null);
    const [autoFocus, setAutoFocus] = useState<boolean>(false);
    const sublevelMenuId = useId();

    const handleSubLevelNavigationButtonClick = (id: string) => {
        if (expandedSubLevelNavigation === id) {
            setExpandedSubLevelNavigation(null);
        } else {
            setExpandedSubLevelNavigation(id);
        }
    };

    useEscapeKeyPressed(() => {
        setExpandedSubLevelNavigation(null);
        setAutoFocus(false);
    });

    return (
        <DesktopHeaderFullHeightNav>
            <TopLevelNavigation>
                {menu.items.map((node) => {
                    return (
                        <TopLevelLinkContainer
                            key={node.id}
                            onMouseEnter={() => setExpandedSubLevelNavigation(node.id)}
                            onMouseLeave={() => {
                                setExpandedSubLevelNavigation(null);
                                setAutoFocus(false);
                            }}
                        >
                            <LinkContainer>
                                <MenuPageLink page={node.node} activeClassName="active">
                                    {node.node.name}
                                </MenuPageLink>
                                {node.node.childNodes.length > 0 && (
                                    <ToggleSubLevelNavigationButton
                                        aria-label={intl.formatMessage(
                                            {
                                                id: "header.subMenu.arialLabel",
                                                defaultMessage: "Submenu of {name}",
                                            },
                                            { name: node.node.name },
                                        )}
                                        aria-controls={sublevelMenuId}
                                        aria-expanded={expandedSubLevelNavigation === node.id}
                                        onClick={() => {
                                            setAutoFocus(true);
                                            handleSubLevelNavigationButtonClick(node.id);
                                        }}
                                    >
                                        <AnimatedChevron
                                            href="/assets/icons/chevron-down.svg#root"
                                            $isExpanded={expandedSubLevelNavigation === node.id}
                                        />
                                    </ToggleSubLevelNavigationButton>
                                )}
                            </LinkContainer>
                            {node.node.childNodes.length > 0 && (
                                <FocusLock disabled={expandedSubLevelNavigation !== node.id} autoFocus={autoFocus}>
                                    <SubLevelNavigation id={sublevelMenuId} $isExpanded={expandedSubLevelNavigation === node.id}>
                                        <CloseSublevelNavigationButton
                                            onClick={() => setExpandedSubLevelNavigation(null)}
                                            aria-label={intl.formatMessage(
                                                {
                                                    id: "header.subMenu.closeButton",
                                                    defaultMessage: "Close submenu of {name}",
                                                },
                                                { name: node.node.name },
                                            )}
                                            aria-controls={sublevelMenuId}
                                        >
                                            <SvgUse href="/assets/icons/menu-open.svg#root" width={16} height={16} />
                                        </CloseSublevelNavigationButton>

                                        {node.node.childNodes.map((node) => (
                                            <li key={node.id}>
                                                <MenuPageLink page={node} activeClassName="active">
                                                    {node.name}
                                                </MenuPageLink>
                                            </li>
                                        ))}
                                    </SubLevelNavigation>
                                </FocusLock>
                            )}
                        </TopLevelLinkContainer>
                    );
                })}
            </TopLevelNavigation>
        </DesktopHeaderFullHeightNav>
    );
};

const DesktopHeaderFullHeightNav = styled.div`
    height: 100%;
    display: none;

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        display: block;
    }
`;

const TopLevelNavigation = styled.ol`
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
    gap: ${({ theme }) => theme.spacing.s600};
    height: 100%;
`;

const SubLevelNavigation = styled.ol<{ $isExpanded: boolean }>`
    display: ${({ $isExpanded }) => ($isExpanded ? "flex" : "none")};
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.s200};
    position: absolute;
    z-index: 40;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    list-style-type: none;
    padding: ${({ theme }) => theme.spacing.s100};
    background-color: white;
    border-left: 1px solid ${({ theme }) => theme.palette.gray["200"]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.gray["200"]};
    border-right: 1px solid ${({ theme }) => theme.palette.gray["200"]};
`;

const TopLevelLinkContainer = styled.li`
    position: relative;

    &:last-child ${SubLevelNavigation} {
        left: auto;
        transform: none;
        right: 0;
    }
`;

const LinkContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.s100};
    height: 100%;
    position: relative;
`;

const ToggleSubLevelNavigationButton = styled.button`
    width: 24px;
    height: 24px;
`;

const AnimatedChevron = styled(SvgUse)<{ $isExpanded: boolean }>`
    width: 100%;
    height: 100%;
    color: ${({ theme, $isExpanded }) => ($isExpanded ? theme.palette.primary.main : theme.palette.text.primary)};
    transform: rotate(${({ $isExpanded }) => ($isExpanded ? "-180deg" : "0deg")});
    transition: transform 0.4s ease;
`;

const CloseSublevelNavigationButton = styled.button`
    opacity: 0;
    background-color: white;
    position: absolute;
    top: 0;
    right: 0;

    pointer-events: none;
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    width: 1px;

    &:focus-visible {
        opacity: 1;
        pointer-events: auto;
        width: auto;
        height: auto;
        clip-path: none;
    }
`;

const MenuPageLink = styled(PageLink)`
    text-decoration: none;
    display: inline-block;
    padding: ${({ theme }) => theme.spacing.s100} 0;
    font-family: ${({ theme }) => theme.fontFamily};
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover {
        color: ${({ theme }) => theme.palette.primary.main};
    }

    &.active {
        text-decoration: underline ${({ theme }) => theme.palette.primary.main};
        text-underline-offset: 8px;
    }
`;
