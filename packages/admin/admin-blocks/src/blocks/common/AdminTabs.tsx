import { RouteWithErrorBoundary } from "@comet/admin";
import { Tab as MuiTab, TabProps, Tabs as MuiTabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { Switch, useRouteMatch } from "react-router";
import { Link, LinkProps } from "react-router-dom";

import { AdminComponentPart } from "../types";
import { TabContent } from "./AdminTabsTabContent";

export interface AdminTabsProps {
    children: AdminComponentPart[];
}

export function AdminTabs({ children }: AdminTabsProps): JSX.Element | null {
    const match = useRouteMatch();
    const tabRouteMatch = useRouteMatch<{ tab: string }>(`${match.path}/:tab`);
    const selected = tabRouteMatch?.params.tab;
    if (children.length < 1) {
        return null;
    }
    const [firstTab, ...otherTabs] = children;
    const selectedTab = children.find((tab) => tab.key === selected) ? selected : firstTab.key; //fall back to first, as <Switch> does
    return (
        <Root key="tabs">
            <Tabs value={selectedTab}>
                {children.map((tab, index) => {
                    const url = index === 0 ? match.url : `${match.url}/${tab.key}`;
                    return <Tab key={tab.key} value={tab.key} label={tab.label} component={Link} to={url} />;
                })}
            </Tabs>
            <TabContent selectedTab={selectedTab}>
                <Switch>
                    {otherTabs.map((tab) => (
                        <RouteWithErrorBoundary key={tab.key} path={`${match.url}/${tab.key}`}>
                            {tab.content}
                        </RouteWithErrorBoundary>
                    ))}

                    {/* first tab is default route, last in <Switch> */}
                    <RouteWithErrorBoundary path={match.url}>{firstTab.content}</RouteWithErrorBoundary>
                </Switch>
            </TabContent>
        </Root>
    );
}

const Root = styled("div")`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Tabs = styled(MuiTabs)`
    background-color: ${({ theme }) => theme.palette.background.default};
`;

const Tab = styled(MuiTab)<TabProps & LinkProps>`
    min-width: 0;
`;
