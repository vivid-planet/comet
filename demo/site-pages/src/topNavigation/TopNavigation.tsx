import { PageLink } from "@src/layout/header/PageLink";
import { gql } from "graphql-request";
import styled from "styled-components";

import { type GQLTopMenuPageTreeNodeFragment } from "./TopNavigation.generated";

interface Props {
    data: GQLTopMenuPageTreeNodeFragment[];
}

export function TopNavigation({ data }: Props): JSX.Element {
    return (
        <TopLevelNavigation>
            {data.map((item) => (
                <TopLevelLinkContainer key={item.id}>
                    <PageLink page={item}>{(active) => <Link $active={active}>{item.name}</Link>}</PageLink>
                    {item.childNodes.length > 0 && (
                        <SubLevelNavigation>
                            {item.childNodes.map((node) => (
                                <li key={node.id}>
                                    <PageLink page={node}>{(active) => <Link $active={active}>{node.name}</Link>}</PageLink>
                                </li>
                            ))}
                        </SubLevelNavigation>
                    )}
                </TopLevelLinkContainer>
            ))}
        </TopLevelNavigation>
    );
}

export const topMenuPageTreeNodeFragment = gql`
    fragment TopMenuPageTreeNode on PageTreeNode {
        id
        name
        ...PageLink

        childNodes {
            id
            name
            ...PageLink
        }
    }
`;

const TopLevelNavigation = styled.ol`
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
    background-color: ${({ theme }) => theme.palette.primary.main};
`;

const SubLevelNavigation = styled.ol`
    display: none;
    position: absolute;
    min-width: 100px;
    list-style-type: none;
    padding: 5px;
    background-color: ${({ theme }) => theme.palette.primary.main};
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

const Link = styled.a<{ $active: boolean }>`
    text-decoration: none;
    padding: 5px 10px;
    color: ${({ $active, theme }) => ($active ? theme.palette.text.inverted : theme.palette.primary.main)};
    font-size: 12px;

    &:hover {
        text-decoration: underline;
    }
`;
