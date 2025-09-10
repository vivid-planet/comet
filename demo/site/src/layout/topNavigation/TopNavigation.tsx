"use client";
import { Button } from "@src/common/components/Button";
import { PageLink } from "@src/layout/header/PageLink";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { type GQLTopMenuPageTreeNodeFragment } from "./TopNavigation.fragment.generated";

interface Props {
    data: GQLTopMenuPageTreeNodeFragment[];
}

export function TopNavigation({ data }: Props): JSX.Element {
    return (
        <>
            <SkipLink href="#mainContent">
                <Button as="span">
                    <FormattedMessage defaultMessage="Skip to main content" id="skipLink.skipToMainContent" />
                </Button>
            </SkipLink>
            <SkipLink href="#footer">
                <Button as="span">
                    <FormattedMessage defaultMessage="Skip to footer" id="skipLink.skipToFooter" />
                </Button>
            </SkipLink>
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
        </>
    );
}

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

const Link = styled(PageLink)`
    text-decoration: none;
    padding: 5px 10px;
    color: ${({ theme }) => theme.palette.text.primary};
    font-size: 12px;

    &:hover {
        text-decoration: underline;
    }

    &.active {
        color: ${({ theme }) => theme.palette.text.inverted};
    }
`;

const SkipLink = styled.a`
    position: fixed;
    top: 120px;
    left: 20px;
    opacity: 0;
    z-index: 100;

    &:focus {
        opacity: 1;
    }
`;
