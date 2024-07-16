"use client";
import { PageLink } from "@src/header/PageLink";
import styled from "styled-components";

import { GQLTopMenuPageTreeNodeFragment } from "./TopNavigation.fragment.generated";

interface Props {
    data: GQLTopMenuPageTreeNodeFragment[];
}

export function TopNavigation({ data }: Props): JSX.Element {
    return (
        <TopLevelNavigation>
            {data.map((item) => (
                <TopLevelLinkContainer key={item.id}>
                    <Link page={item} activeClassName="active">
                        {item.name}
                    </Link>
                    {item.childNodes.length > 0 && (
                        <SubLevelNavigation>
                            {item.childNodes.map((node) => (
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
    );
}

const TopLevelNavigation = styled.ol`
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
    background-color: ${({ theme }) => theme.colors.primary};
`;

const SubLevelNavigation = styled.ol`
    display: none;
    position: absolute;
    min-width: 100px;
    list-style-type: none;
    padding: 5px;
    background-color: ${({ theme }) => theme.colors.primary};
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
    color: ${({ theme }) => theme.colors.n200};
    font-size: 12px;

    &:hover {
        text-decoration: underline;
    }

    &.active {
        color: ${({ theme }) => theme.colors.white};
    }
`;
