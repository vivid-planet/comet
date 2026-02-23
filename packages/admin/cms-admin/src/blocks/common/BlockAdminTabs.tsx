import { RouteWithErrorBoundary } from "@comet/admin";
import { Tab as MuiTab, type TabProps, Tabs as MuiTabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { matchPath, UNSAFE_RouteContext, useLocation } from "react-router";
import { Link, type LinkProps } from "react-router-dom";

import { type BlockAdminComponentPart } from "../types";
import { TabContent } from "./AdminTabsTabContent";

export interface BlockAdminTabsProps {
    children: BlockAdminComponentPart[];
}

export function BlockAdminTabs({ children }: BlockAdminTabsProps): JSX.Element | null {
    const routeContext = useContext(UNSAFE_RouteContext);
    const currentMatch = routeContext.matches[routeContext.matches.length - 1];
    const matchUrl = currentMatch?.pathnameBase ?? "";
    const matchRoutePath = currentMatch?.route?.path ?? "";
    const location = useLocation();
    const tabMatch = matchPath({ path: `${matchRoutePath}/:tab`, end: false }, location.pathname);
    const selected = tabMatch?.params?.tab;
    if (children.length < 1) {
        return null;
    }
    const [firstTab, ...otherTabs] = children;
    const selectedTab = children.find((tab) => tab.key === selected) ? selected : firstTab.key; //fall back to first, as <Switch> does
    return (
        <Root key="tabs">
            <Tabs value={selectedTab} variant="scrollable" scrollButtons="auto">
                {children.map((tab, index) => {
                    const url = index === 0 ? matchUrl : `${matchUrl}/${tab.key}`;
                    return <Tab key={tab.key} value={tab.key} label={tab.label} component={Link} to={url} />;
                })}
            </Tabs>
            <TabContent selectedTab={selectedTab}>
                {otherTabs.map((tab) => (
                    <RouteWithErrorBoundary key={tab.key} path={`${matchUrl}/${tab.key}`}>
                        {tab.content}
                    </RouteWithErrorBoundary>
                ))}

                {/* first tab is default route, last in rendering order */}
                <RouteWithErrorBoundary path={matchUrl}>{firstTab.content}</RouteWithErrorBoundary>
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
    flex-shrink: 0;
    margin-bottom: 0;
`;

const Tab = styled(MuiTab)<TabProps & LinkProps>`
    min-width: 0;
`;
