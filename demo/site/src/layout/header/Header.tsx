"use client";

import styled from "styled-components";

import { type GQLHeaderFragment } from "./Header.fragment.generated";
import { PageLink } from "./PageLink";

interface Props {
    header: GQLHeaderFragment;
}

function Header({ header }: Props): JSX.Element {
    return (
        <Root>
            <nav>
                <TopLevelNavigation>
                    {header.items.map((item) => (
                        <TopLevelLinkContainer key={item.id}>
                            <Link page={item.node} activeClassName="active">
                                {item.node.name}
                            </Link>
                            {item.node.childNodes.length > 0 && (
                                <ToggleSubLevelNavigationButton>
                                    <Chevron />
                                </ToggleSubLevelNavigationButton>
                            )}
                            {item.node.childNodes.length > 0 && (
                                <SubLevelNavigation>
                                    {item.node.childNodes.map((node) => (
                                        <li key={node.id}>
                                            <Link page={node} activeClassName="active">
                                                {node.name}
                                            </Link>
                                        </li>
                                    ))}
                                </SubLevelNavigation>
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

const SubLevelNavigation = styled.ol`
    display: none;
    position: absolute;
    min-width: 100px;
    list-style-type: none;
    padding: 5px;
    background-color: white;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
`;

const TopLevelLinkContainer = styled.li`
    position: relative;

    &:hover {
        text-decoration: underline;

        & > ${SubLevelNavigation} {
            display: block;
        }
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
    right: 0;
    border: none;
    width: 10px;
    height: 10px;
    transform: translate(0, -50%);
    background-color: transparent;
    opacity: 0;

    &:focus-visible {
        opacity: 1;
    }
`;

const Chevron = styled.div`
    width: 5px;
    height: 5px;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    transform: rotate(45deg);
`;

export { Header };
