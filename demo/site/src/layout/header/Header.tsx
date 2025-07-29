"use client";

import { SvgUse } from "@src/common/helpers/SvgUse";
import { useListenToEscapeKey } from "@src/util/useListenToEscapeKey";
import { useState } from "react";
import FocusLock from "react-focus-lock";
import styled from "styled-components";

import { type GQLHeaderFragment } from "./Header.fragment.generated";
import { PageLink } from "./PageLink";

interface Props {
    header: GQLHeaderFragment;
}

function Header({ header }: Props): JSX.Element {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleToggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useListenToEscapeKey(() => {
        setOpenMenuId(null);
    });

    return (
        <Root>
            <nav>
                <TopLevelNavigation>
                    {header.items.map((item) => (
                        <TopLevelLinkContainer key={item.id} onMouseEnter={() => setOpenMenuId(item.id)}>
                            <Link page={item.node} activeClassName="active">
                                {item.node.name}
                            </Link>
                            {item.node.childNodes.length > 0 && (
                                <>
                                    <ToggleSubLevelNavigationButton onClick={() => handleToggleMenu(item.id)}>
                                        <SvgUse href="/assets/icons/chevron-down.svg#root" width={16} height={16} />
                                    </ToggleSubLevelNavigationButton>

                                    <SubLevelNavigationRoot $isOpen={openMenuId === item.id}>
                                        <FocusLock disabled={openMenuId !== item.id}>
                                            <SubLevelNavigation>
                                                {item.node.childNodes.map((node) => (
                                                    <li key={node.id}>
                                                        <Link page={node} activeClassName="active">
                                                            {node.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                                <ReturnButton onClick={() => setOpenMenuId(null)}>Return to {item.node.name}</ReturnButton>
                                            </SubLevelNavigation>
                                        </FocusLock>
                                    </SubLevelNavigationRoot>
                                </>
                            )}
                        </TopLevelLinkContainer>
                    ))}
                </TopLevelNavigation>
            </nav>
        </Root>
    );
}

const Root = styled.header`
    padding: 10px 20px;
`;

const TopLevelNavigation = styled.ol`
    display: flex;
    list-style-type: none;
    padding: 0;
`;

const SubLevelNavigationRoot = styled.div<{ $isOpen: boolean }>`
    display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const SubLevelNavigation = styled.ol`
    position: absolute;
    min-width: 100px;
    list-style-type: none;
    padding: 5px;
    background-color: white;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
    z-index: 1;
`;

const TopLevelLinkContainer = styled.li`
    position: relative;

    &:hover {
        text-decoration: underline;

        & > ${SubLevelNavigationRoot} {
            display: block;
        }
    }
`;

const ReturnButton = styled.button`
    opacity: 0;
    background-color: white;
    text-align: left;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    padding-left: 10px;

    &:focus-visible {
        opacity: 1;
    }
`;

const Link = styled(PageLink)`
    text-decoration: none;
    padding: 5px 10px;
    color: ${({ theme }) => theme.palette.text.primary};

    &:hover {
        text-decoration: underline;
    }

    &.active {
        color: ${({ theme }) => theme.palette.primary.main};
    }
`;

const ToggleSubLevelNavigationButton = styled.button`
    position: absolute;
    top: 50%;
    right: -5px;
    border: none;
    width: 16px;
    height: 16px;
    transform: translate(0, -50%);
    background-color: transparent;
    opacity: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:focus-visible {
        opacity: 1;
    }
`;

export { Header };
