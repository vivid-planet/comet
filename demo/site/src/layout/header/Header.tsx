"use client";

import { Button } from "@src/common/components/Button";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";

import { type GQLHeaderFragment } from "./Header.fragment.generated";
import { PageLink } from "./PageLink";

interface Props {
    header: GQLHeaderFragment;
}

function Header({ header }: Props): JSX.Element {
    const intl = useIntl();
    return (
        <Root>
            <nav
                aria-label={intl.formatMessage({
                    defaultMessage: "Skip links",
                    id: "skipLinks.ariaLabel",
                })}
            >
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
                    {header.items.map((item) => (
                        <TopLevelLinkContainer key={item.id}>
                            <Link page={item.node} activeClassName="active">
                                {item.node.name}
                            </Link>
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
export { Header };
